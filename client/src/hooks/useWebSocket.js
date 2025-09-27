/**
 * useWebSocket - Custom hook for WebSocket connection management
 * Provides real-time communication capabilities with automatic reconnection
 */
import { useState, useEffect, useRef, useCallback } from 'react';

const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectCountRef = useRef(0);
  
  // Default options
  const defaultOptions = {
    reconnectAttempts: 5,
    reconnectInterval: 3000,
    heartbeatInterval: 30000,
    protocols: [],
    ...options
  };

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      setConnectionStatus('Connecting...');
      setError(null);
      
      const ws = new WebSocket(url, defaultOptions.protocols);
      socketRef.current = ws;
      setSocket(ws);

      ws.onopen = (event) => {
        setIsConnected(true);
        setConnectionStatus('Connected');
        setError(null);
        reconnectCountRef.current = 0;
        
        if (options.onOpen) {
          options.onOpen(event);
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage({
            data,
            timestamp: Date.now(),
            raw: event.data
          });
          
          if (options.onMessage) {
            options.onMessage(data, event);
          }
        } catch (parseError) {
          // Handle non-JSON messages
          setLastMessage({
            data: event.data,
            timestamp: Date.now(),
            raw: event.data
          });
          
          if (options.onMessage) {
            options.onMessage(event.data, event);
          }
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setConnectionStatus('Disconnected');
        socketRef.current = null;
        setSocket(null);
        
        if (options.onClose) {
          options.onClose(event);
        }

        // Attempt to reconnect if not closed intentionally
        if (!event.wasClean && reconnectCountRef.current < defaultOptions.reconnectAttempts) {
          setTimeout(() => {
            reconnectCountRef.current += 1;
            setConnectionStatus(`Reconnecting... (${reconnectCountRef.current}/${defaultOptions.reconnectAttempts})`);
            connect();
          }, defaultOptions.reconnectInterval);
        }
      };

      ws.onerror = (event) => {
        const errorMessage = 'WebSocket connection error';
        setError(errorMessage);
        setConnectionStatus('Error');
        
        if (options.onError) {
          options.onError(event);
        }
      };

    } catch (err) {
      setError(err.message);
      setConnectionStatus('Error');
    }
  }, [url, defaultOptions.protocols, defaultOptions.reconnectAttempts, defaultOptions.reconnectInterval, options]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (socketRef.current) {
      socketRef.current.close(1000, 'Manual disconnect');
    }
    
    setIsConnected(false);
    setConnectionStatus('Disconnected');
    setSocket(null);
    reconnectCountRef.current = defaultOptions.reconnectAttempts; // Prevent reconnection
  }, [defaultOptions.reconnectAttempts]);

  // Send message
  const sendMessage = useCallback((message) => {
    if (socketRef.current && isConnected) {
      try {
        const messageToSend = typeof message === 'string' ? message : JSON.stringify(message);
        socketRef.current.send(messageToSend);
        return true;
      } catch (err) {
        setError(`Failed to send message: ${err.message}`);
        return false;
      }
    } else {
      setError('WebSocket is not connected');
      return false;
    }
  }, [isConnected]);

  // Send JSON message
  const sendJSON = useCallback((data) => {
    return sendMessage(JSON.stringify(data));
  }, [sendMessage]);

  // Manual reconnect
  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(connect, 100);
  }, [connect, disconnect]);

  // Setup heartbeat
  useEffect(() => {
    if (isConnected && defaultOptions.heartbeatInterval > 0) {
      const heartbeatInterval = setInterval(() => {
        if (socketRef.current) {
          sendMessage(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
        }
      }, defaultOptions.heartbeatInterval);

      return () => clearInterval(heartbeatInterval);
    }
  }, [isConnected, defaultOptions.heartbeatInterval, sendMessage]);

  // Connect on mount
  useEffect(() => {
    if (url) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [url]); // Only reconnect if URL changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [disconnect]);

  return {
    socket,
    isConnected,
    error,
    lastMessage,
    connectionStatus,
    connect,
    disconnect,
    reconnect,
    sendMessage,
    sendJSON
  };
};

export default useWebSocket;