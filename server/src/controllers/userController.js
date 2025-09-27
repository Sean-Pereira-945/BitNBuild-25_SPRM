const asyncHandler = require('../utils/asyncHandler');
const respond = require('../utils/respond');
const AppError = require('../utils/AppError');
const User = require('../models/User');

/**
 * GET /api/users/profile/:id
 */
const getProfile = asyncHandler(async (req, res) => {
  const viewer = req.user;
  const user = await User.findById(req.params.id)
    .select('-password -security -resetPasswordToken -resetPasswordExpires -integrations')
    .populate('certificates.eventId', 'title date location');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!user.isProfileVisibleTo(viewer)) {
    throw new AppError('This profile is private', 403);
  }

  const isOwner = viewer && viewer._id.equals(user._id);
  const profile = user.toObject({ virtuals: true });

  if (!isOwner) {
    delete profile.notificationPreferences;
    delete profile.preferences;
    delete profile.email;
    delete profile.walletAddress;
    delete profile.following;
    delete profile.followers;
  }

  return respond(res, 200, {
    data: {
      user: profile,
      stats: user.getStats(),
    },
  });
});

/**
 * POST /api/users/follow/:id
 */
const toggleFollow = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id.toString()) {
    throw new AppError('You cannot follow yourself', 400);
  }

  const [currentUser, targetUser] = await Promise.all([
    User.findById(req.user.id),
    User.findById(req.params.id),
  ]);

  if (!targetUser) {
    throw new AppError('User not found', 404);
  }

  if (!Array.isArray(currentUser.following)) {
    currentUser.following = [];
  }
  if (!Array.isArray(targetUser.followers)) {
    targetUser.followers = [];
  }
  if (!Array.isArray(currentUser.followedOrganizers)) {
    currentUser.followedOrganizers = [];
  }

  const followingIndex = currentUser.following.findIndex((f) => f.user.equals(targetUser.id));

  if (followingIndex > -1) {
    currentUser.following.splice(followingIndex, 1);
    targetUser.followers = targetUser.followers.filter((f) => !f.user.equals(currentUser.id));

    if (targetUser.isOrganizer()) {
      currentUser.followedOrganizers = currentUser.followedOrganizers.filter(
        (organizerId) => !organizerId.equals(targetUser.id)
      );
    }

    await Promise.all([currentUser.save(), targetUser.save()]);
    return respond(res, 200, { message: 'Unfollowed user', data: { isFollowing: false } });
  }

  currentUser.following.push({ user: targetUser.id });
  targetUser.followers.push({ user: currentUser.id });

  if (targetUser.isOrganizer()) {
    const alreadyFollowing = currentUser.followedOrganizers.some((organizerId) => organizerId.equals(targetUser.id));
    if (!alreadyFollowing) {
      currentUser.followedOrganizers.push(targetUser.id);
    }
  }
  await Promise.all([currentUser.save(), targetUser.save()]);

  return respond(res, 200, { message: 'User followed', data: { isFollowing: true } });
});

/**
 * GET /api/users/organizers
 */
const listOrganizers = asyncHandler(async (req, res) => {
  const organizers = await User.findByRole('organizer')
    .find({ profileVisibility: 'public' })
    .select('name avatar bio location eventsOrganized followers profileVisibility walletAddress')
    .lean();

  return respond(res, 200, { data: organizers });
});

module.exports = {
  getProfile,
  toggleFollow,
  listOrganizers,
};
