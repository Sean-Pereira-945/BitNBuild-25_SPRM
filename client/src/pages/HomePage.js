import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

import Button from '../components/UI/Button';
import { getEvents } from '../services/eventService';
import './pages.css';

const features = [
  {
    title: 'Instant blockchain notarisation',
    description:
      'Every ticket scan and NFT badge minting is sealed on-chain, giving attendees and partners verifiable proof in seconds.',
    accent: '01'
  },
  {
    title: 'Automation that scales with you',
    description:
      'Trigger reminders, follow-ups, and badge printing with flexible automation flows that adapt to virtual, hybrid, or in-person events.',
    accent: '02'
  },
  {
    title: 'Insights that keep momentum',
    description:
      'Monitor attendance, engagement, and badge uptake in real-time dashboards, then sync results straight to your CRM.',
    accent: '03'
  }
];

const highlights = [
  { label: 'Events launched', value: '1.2k+' },
  { label: 'NFT badges minted', value: '82k' },
  { label: 'Verification uptime', value: '99.98%' },
  { label: 'Avg. onboarding time', value: '4 min' }
];

const roadmap = [
  {
    title: 'Launch resilient events',
    description: 'Blueprint templates, guest import, and smart capacity rules ensure every launch is organised and on brand.'
  },
  {
    title: 'Delight attendees instantly',
    description: 'Responsive check-in flows, wallet-ready NFT badges, and push notifications keep guests in the loop.'
  },
  {
    title: 'Prove outcomes with confidence',
    description: 'Export tamper-proof NFT badges, publish public verification portals, and share success metrics with stakeholders.'
  }
];

const animation = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

const HomePage = () => {
  const navigate = useNavigate();
  // Fetch public events
  const { data: eventsPayload } = useQuery({
    queryKey: ['events', 'public-home'],
    queryFn: async () => {
      const response = await getEvents();
      return response.data;
    },
    staleTime: 1000 * 60 * 5
  });
  const events = Array.isArray(eventsPayload?.data) ? eventsPayload.data : [];

  return (
    <div className="home" aria-labelledby="home-heading">
      <section className="home__hero gradient-surface">
        <motion.div className="home__hero-content" {...animation}>
          <p className="home__eyebrow">Trusted verification for future-proof events</p>
          <h1 id="home-heading">Craft unforgettable experiences, backed by blockchain certainty.</h1>
          <p className="home__lead">
            EventChain unifies registration, live engagement, certificate issuance, and verifiable analytics into one beautifully
            orchestrated workspace. Launch in minutes and keep your community connected long after the closing keynote.
          </p>
          <div className="home__cta">
            <Button type="button" size="lg" onClick={() => navigate('/register')}>
              Start for free
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/events')}>
              Explore the dashboard
            </Button>
          </div>
          <div className="home__meta">
            <span>🎟️ Verified tickets &amp; certificates</span>
            <span>⚡ Realtime analytics</span>
            <span>🔐 SOC2-ready security</span>
          </div>
        </motion.div>
        <motion.div className="home__stats" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {highlights.map((item) => (
            <div key={item.label} className="home__stat">
              <span className="home__stat-value">{item.value}</span>
              <span className="home__stat-label">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="home__features card">
        <motion.div className="home__section-head" {...animation}>
          <p className="home__eyebrow">Why teams choose EventChain</p>
          <h2>Purpose-built for ops, marketing, and compliance teams alike.</h2>
        </motion.div>
        <div className="home__feature-grid">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              className="home__feature"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <span className="home__feature-index">{feature.accent}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="home__journey">
        <motion.div className="home__section-head" {...animation}>
          <p className="home__eyebrow">Deliver value end-to-end</p>
          <h2>From idea to impact in one streamlined journey.</h2>
        </motion.div>
        <div className="home__timeline">
          {roadmap.map((item, index) => (
            <motion.div
              key={item.title}
              className="home__timeline-step"
              initial={{ opacity: 0, x: index % 2 === 0 ? -32 : 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="home__timeline-index">{index + 1}</div>
              <div className="home__timeline-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="home__public-events card">
        <h2>Upcoming Public Events</h2>
        {events.length === 0 ? (
          <p>No public events available right now.</p>
        ) : (
          <div className="home__public-event-list">
            {events.slice(0, 3).map((event) => (
              <div key={event._id} className="home__public-event">
                <h3>{event.title}</h3>
                <p>{event.shortDescription || event.description}</p>
                <p>
                  <strong>Date:</strong> {event.date?.slice(0, 10)} | <strong>Location:</strong> {event.location?.city},{' '}
                  {event.location?.country}
                </p>
                <Button size="sm" variant="outline" onClick={() => navigate(`/events?event=${event._id}`)}>
                  View Event
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="home__cta-block gradient-surface">
        <motion.div className="home__cta-content" {...animation}>
          <h2>Ready for the next flagship event?</h2>
          <p>
            Spin up a collaborative workspace, invite teammates, and launch your first blockchain-backed experience in under ten
            minutes. No credit card required.
          </p>
          <div className="home__cta">
            <Button size="lg" onClick={() => navigate('/register')}>
              Create organisation
            </Button>
            <Link to="/contact" className="home__link">
              Talk to our team →
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
