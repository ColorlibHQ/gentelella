---
layout: default
title: API Integration
nav_order: 8
---

# API Integration Guide
{: .no_toc }

Learn how to integrate Gentelella Admin Template with backend APIs and external services
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## REST API Integration

### HTTP Client Setup

#### Axios Configuration

```javascript
// src/js/api/http-client.js
import axios from 'axios';

class HttpClient {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    this.setupInterceptors();
  }
  
  setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }
  
  handleUnauthorized() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/login.html';
  }
  
  formatError(error) {
    if (error.response) {
      return {
        message: error.response.data?.message || 'Server error',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      return {
        message: 'Network error - please check your connection',
        status: 0
      };
    } else {
      return {
        message: error.message || 'Unknown error occurred',
        status: -1
      };
    }
  }
  
  // HTTP methods
  get(url, config = {}) {
    return this.client.get(url, config);
  }
  
  post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }
  
  put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }
  
  patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config);
  }
  
  delete(url, config = {}) {
    return this.client.delete(url, config);
  }
  
  // File upload
  upload(url, file, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      }
    });
  }
}

// Create singleton instance
export const httpClient = new HttpClient();
```

### API Service Layer

#### Base Service Class

```javascript
// src/js/api/base-service.js
import { httpClient } from './http-client.js';

export class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.http = httpClient;
  }
  
  async getAll(params = {}) {
    try {
      const response = await this.http.get(this.endpoint, { params });
      return {
        success: true,
        data: response.data,
        meta: response.meta
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }
  
  async getById(id) {
    try {
      const response = await this.http.get(`${this.endpoint}/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }
  
  async create(data) {
    try {
      const response = await this.http.post(this.endpoint, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }
  
  async update(id, data) {
    try {
      const response = await this.http.put(`${this.endpoint}/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }
  
  async delete(id) {
    try {
      await this.http.delete(`${this.endpoint}/${id}`);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }
  
  async search(query, params = {}) {
    try {
      const response = await this.http.get(`${this.endpoint}/search`, {
        params: { q: query, ...params }
      });
      return {
        success: true,
        data: response.data,
        meta: response.meta
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }
}
```

#### Specific Service Classes

```javascript
// src/js/api/user-service.js
import { BaseService } from './base-service.js';

class UserService extends BaseService {
  constructor() {
    super('/users');
  }
  
  async authenticate(credentials) {
    try {
      const response = await this.http.post('/auth/login', credentials);
      
      // Store auth token
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async logout() {
    try {
      await this.http.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error.message);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login.html';
    }
  }
  
  async getCurrentUser() {
    try {
      const response = await this.http.get('/auth/me');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async updateProfile(data) {
    try {
      const response = await this.http.put('/auth/profile', data);
      
      // Update stored user data
      localStorage.setItem('user_data', JSON.stringify(response.data));
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async changePassword(passwordData) {
    try {
      const response = await this.http.post('/auth/change-password', passwordData);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async uploadAvatar(file, onProgress) {
    try {
      const response = await this.http.upload('/auth/avatar', file, onProgress);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export const userService = new UserService();

// src/js/api/dashboard-service.js
import { BaseService } from './base-service.js';

class DashboardService extends BaseService {
  constructor() {
    super('/dashboard');
  }
  
  async getStats(dateRange = '30d') {
    try {
      const response = await this.http.get('/dashboard/stats', {
        params: { range: dateRange }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async getChartData(chartType, params = {}) {
    try {
      const response = await this.http.get(`/dashboard/charts/${chartType}`, {
        params
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async getRecentActivity(limit = 10) {
    try {
      const response = await this.http.get('/dashboard/activity', {
        params: { limit }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export const dashboardService = new DashboardService();
```

---

## Real-time Integration

### WebSocket Connection

```javascript
// src/js/api/websocket-client.js
class WebSocketClient {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.isConnected = false;
  }
  
  connect() {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
    const token = localStorage.getItem('auth_token');
    
    this.ws = new WebSocket(`${wsUrl}?token=${token}`);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connected');
    };
    
    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      this.emit('disconnected');
      this.reconnect();
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }
  
  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }
  
  handleMessage(message) {
    const { type, data } = message;
    this.emit(type, data);
  }
  
  send(type, data = {}) {
    if (!this.isConnected) {
      console.warn('WebSocket not connected');
      return false;
    }
    
    const message = JSON.stringify({ type, data });
    this.ws.send(message);
    return true;
  }
  
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }
  
  emit(event, data) {
    if (!this.listeners.has(event)) return;
    
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in WebSocket event handler for ${event}:`, error);
      }
    });
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}

// Create singleton instance
export const wsClient = new WebSocketClient();

// Auto-connect if user is authenticated
if (localStorage.getItem('auth_token')) {
  wsClient.connect();
}
```

### Real-time Dashboard Updates

```javascript
// src/js/dashboard/real-time-dashboard.js
import { wsClient } from '../api/websocket-client.js';
import { dashboardService } from '../api/dashboard-service.js';

class RealTimeDashboard {
  constructor() {
    this.charts = new Map();
    this.stats = new Map();
    this.init();
  }
  
  init() {
    this.setupWebSocketListeners();
    this.loadInitialData();
  }
  
  setupWebSocketListeners() {
    // Listen for real-time stats updates
    wsClient.on('stats.update', (data) => {
      this.updateStats(data);
    });
    
    // Listen for new chart data
    wsClient.on('chart.data', (data) => {
      this.updateChart(data.chartId, data.data);
    });
    
    // Listen for new notifications
    wsClient.on('notification', (data) => {
      this.showNotification(data);
    });
    
    // Listen for user activity
    wsClient.on('user.activity', (data) => {
      this.updateActivityFeed(data);
    });
  }
  
  async loadInitialData() {
    try {
      // Load dashboard stats
      const statsResult = await dashboardService.getStats();
      if (statsResult.success) {
        this.renderStats(statsResult.data);
      }
      
      // Load chart data
      const chartTypes = ['sales', 'users', 'revenue'];
      for (const chartType of chartTypes) {
        const chartResult = await dashboardService.getChartData(chartType);
        if (chartResult.success) {
          this.renderChart(chartType, chartResult.data);
        }
      }
      
      // Load recent activity
      const activityResult = await dashboardService.getRecentActivity();
      if (activityResult.success) {
        this.renderActivity(activityResult.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }
  
  updateStats(data) {
    Object.entries(data).forEach(([key, value]) => {
      const element = document.querySelector(`[data-stat="${key}"]`);
      if (element) {
        // Animate value change
        this.animateValue(element, value);
      }
    });
  }
  
  animateValue(element, newValue) {
    const currentValue = parseFloat(element.textContent.replace(/[^0-9.-]/g, '')) || 0;
    const difference = newValue - currentValue;
    const steps = 30;
    const stepValue = difference / steps;
    let current = currentValue;
    
    const timer = setInterval(() => {
      current += stepValue;
      element.textContent = this.formatValue(current, element.dataset.format);
      
      if (--steps <= 0) {
        clearInterval(timer);
        element.textContent = this.formatValue(newValue, element.dataset.format);
      }
    }, 16);
  }
  
  formatValue(value, format) {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(Math.round(value));
      default:
        return value.toString();
    }
  }
  
  updateChart(chartId, newData) {
    const chart = this.charts.get(chartId);
    if (!chart) return;
    
    // Update chart data
    chart.data = newData;
    chart.update('active');
  }
  
  showNotification(data) {
    // Use notification plugin or create custom notification
    if (window.GentelellaPlugins && window.GentelellaPlugins.getPlugin('notifications')) {
      const notifications = window.GentelellaPlugins.getPlugin('notifications');
      notifications.show(data.message, data.type);
    }
  }
  
  updateActivityFeed(activity) {
    const feedContainer = document.querySelector('#activity-feed');
    if (!feedContainer) return;
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
      <div class="activity-icon">
        <i class="fa fa-${activity.icon}"></i>
      </div>
      <div class="activity-content">
        <div class="activity-text">${activity.message}</div>
        <div class="activity-time">${this.formatTime(activity.timestamp)}</div>
      </div>
    `;
    
    // Add to top of feed
    feedContainer.insertBefore(activityItem, feedContainer.firstChild);
    
    // Remove oldest items if feed is too long
    const items = feedContainer.querySelectorAll('.activity-item');
    if (items.length > 10) {
      for (let i = 10; i < items.length; i++) {
        items[i].remove();
      }
    }
  }
  
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  }
}

// Initialize real-time dashboard
new RealTimeDashboard();
```

---

## Data Management

### State Management

```javascript
// src/js/store/app-store.js
class AppStore {
  constructor() {
    this.state = {
      user: null,
      theme: 'light',
      sidebarCollapsed: false,
      notifications: [],
      loading: false,
      error: null
    };
    
    this.listeners = new Map();
    this.loadFromStorage();
  }
  
  // Get current state
  getState() {
    return { ...this.state };
  }
  
  // Update state
  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    // Notify listeners
    this.notifyListeners(prevState, this.state);
    
    // Persist certain state to localStorage
    this.saveToStorage();
  }
  
  // Subscribe to state changes
  subscribe(listener) {
    const id = Date.now() + Math.random();
    this.listeners.set(id, listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(id);
    };
  }
  
  notifyListeners(prevState, newState) {
    this.listeners.forEach(listener => {
      try {
        listener(newState, prevState);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }
  
  loadFromStorage() {
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        this.state.user = JSON.parse(userData);
      }
      
      const theme = localStorage.getItem('theme');
      if (theme) {
        this.state.theme = theme;
      }
      
      const sidebarCollapsed = localStorage.getItem('sidebar-collapsed');
      if (sidebarCollapsed) {
        this.state.sidebarCollapsed = sidebarCollapsed === 'true';
      }
    } catch (error) {
      console.error('Failed to load state from storage:', error);
    }
  }
  
  saveToStorage() {
    try {
      if (this.state.user) {
        localStorage.setItem('user_data', JSON.stringify(this.state.user));
      }
      
      localStorage.setItem('theme', this.state.theme);
      localStorage.setItem('sidebar-collapsed', this.state.sidebarCollapsed.toString());
    } catch (error) {
      console.error('Failed to save state to storage:', error);
    }
  }
  
  // Action methods
  setUser(user) {
    this.setState({ user });
  }
  
  clearUser() {
    this.setState({ user: null });
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_token');
  }
  
  setTheme(theme) {
    this.setState({ theme });
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  toggleSidebar() {
    this.setState({ sidebarCollapsed: !this.state.sidebarCollapsed });
  }
  
  addNotification(notification) {
    const notifications = [...this.state.notifications, {
      id: Date.now(),
      timestamp: new Date(),
      ...notification
    }];
    this.setState({ notifications });
  }
  
  removeNotification(id) {
    const notifications = this.state.notifications.filter(n => n.id !== id);
    this.setState({ notifications });
  }
  
  setLoading(loading) {
    this.setState({ loading });
  }
  
  setError(error) {
    this.setState({ error });
  }
  
  clearError() {
    this.setState({ error: null });
  }
}

// Create singleton instance
export const appStore = new AppStore();

// Helper hook for components
export function useStore(selector) {
  const state = appStore.getState();
  return selector ? selector(state) : state;
}
```

### Data Caching

```javascript
// src/js/cache/data-cache.js
class DataCache {
  constructor() {
    this.cache = new Map();
    this.expiry = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }
  
  set(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, data);
    this.expiry.set(key, Date.now() + ttl);
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }
    
    const expiryTime = this.expiry.get(key);
    if (Date.now() > expiryTime) {
      this.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }
  
  has(key) {
    return this.get(key) !== null;
  }
  
  delete(key) {
    this.cache.delete(key);
    this.expiry.delete(key);
  }
  
  clear() {
    this.cache.clear();
    this.expiry.clear();
  }
  
  cleanup() {
    const now = Date.now();
    for (const [key, expiryTime] of this.expiry.entries()) {
      if (now > expiryTime) {
        this.delete(key);
      }
    }
  }
  
  size() {
    return this.cache.size;
  }
}

// Create singleton instance
export const dataCache = new DataCache();

// Auto cleanup every 5 minutes
setInterval(() => {
  dataCache.cleanup();
}, 5 * 60 * 1000);
```

---

## Authentication Integration

### JWT Token Management

```javascript
// src/js/auth/auth-manager.js
class AuthManager {
  constructor() {
    this.token = localStorage.getItem('auth_token');
    this.refreshTimer = null;
    this.init();
  }
  
  init() {
    if (this.token) {
      this.scheduleTokenRefresh();
    }
  }
  
  async login(credentials) {
    try {
      const response = await userService.authenticate(credentials);
      
      if (response.success) {
        this.token = response.data.token;
        this.scheduleTokenRefresh();
        
        // Update app state
        appStore.setUser(response.data.user);
        
        return response;
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  logout() {
    this.clearTokenRefresh();
    this.token = null;
    
    // Clear app state
    appStore.clearUser();
    
    // Call logout service
    userService.logout();
  }
  
  isAuthenticated() {
    return !!this.token && !this.isTokenExpired();
  }
  
  isTokenExpired() {
    if (!this.token) return true;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }
  
  async refreshToken() {
    try {
      const response = await httpClient.post('/auth/refresh');
      
      if (response.token) {
        this.token = response.token;
        localStorage.setItem('auth_token', this.token);
        this.scheduleTokenRefresh();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      return false;
    }
  }
  
  scheduleTokenRefresh() {
    this.clearTokenRefresh();
    
    if (!this.token) return;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const refreshTime = expiryTime - (5 * 60 * 1000); // 5 minutes before expiry
      const timeUntilRefresh = refreshTime - Date.now();
      
      if (timeUntilRefresh > 0) {
        this.refreshTimer = setTimeout(() => {
          this.refreshToken();
        }, timeUntilRefresh);
      } else {
        // Token expired or will expire soon
        this.refreshToken();
      }
    } catch (error) {
      console.error('Failed to schedule token refresh:', error);
    }
  }
  
  clearTokenRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
  
  getToken() {
    return this.token;
  }
  
  getUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
}

// Create singleton instance
export const authManager = new AuthManager();

// Route protection
export function requireAuth() {
  if (!authManager.isAuthenticated()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

// Auto-redirect if not authenticated (for protected pages)
if (document.querySelector('[data-require-auth]')) {
  requireAuth();
}
```

---

## Error Handling

### Global Error Handler

```javascript
// src/js/error/error-handler.js
class ErrorHandler {
  constructor() {
    this.setupGlobalHandlers();
  }
  
  setupGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleError(event.reason, 'Promise Rejection');
      event.preventDefault();
    });
    
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('JavaScript error:', event.error);
      this.handleError(event.error, 'JavaScript Error');
    });
    
    // Handle API errors
    document.addEventListener('api-error', (event) => {
      this.handleApiError(event.detail);
    });
  }
  
  handleError(error, context = 'Unknown') {
    const errorInfo = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      context,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      user: authManager.getUser()?.id
    };
    
    // Log to console
    console.error('Error handled:', errorInfo);
    
    // Send to error tracking service
    this.reportError(errorInfo);
    
    // Show user-friendly notification
    this.showErrorNotification(error);
  }
  
  handleApiError(error) {
    if (error.status === 401) {
      this.handleUnauthorized();
    } else if (error.status >= 500) {
      this.showErrorNotification({
        message: 'Server error occurred. Please try again later.'
      });
    } else {
      this.showErrorNotification(error);
    }
  }
  
  handleUnauthorized() {
    // Clear auth data and redirect to login
    authManager.logout();
  }
  
  showErrorNotification(error) {
    // Use notification plugin if available
    if (window.GentelellaPlugins && window.GentelellaPlugins.getPlugin('notifications')) {
      const notifications = window.GentelellaPlugins.getPlugin('notifications');
      notifications.show(error.message || 'An error occurred', 'error');
    } else {
      // Fallback to alert
      alert(error.message || 'An error occurred');
    }
  }
  
  async reportError(errorInfo) {
    try {
      // Send error to monitoring service
      await httpClient.post('/errors/report', errorInfo);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }
}

// Initialize global error handler
new ErrorHandler();
```

---

## Performance Optimization

### Request Batching

```javascript
// src/js/api/request-batcher.js
class RequestBatcher {
  constructor() {
    this.batches = new Map();
    this.batchDelay = 100; // ms
  }
  
  batch(endpoint, id, params = {}) {
    return new Promise((resolve, reject) => {
      if (!this.batches.has(endpoint)) {
        this.batches.set(endpoint, {
          requests: [],
          timer: null
        });
      }
      
      const batch = this.batches.get(endpoint);
      batch.requests.push({ id, params, resolve, reject });
      
      // Clear existing timer and set new one
      if (batch.timer) {
        clearTimeout(batch.timer);
      }
      
      batch.timer = setTimeout(() => {
        this.executeBatch(endpoint);
      }, this.batchDelay);
    });
  }
  
  async executeBatch(endpoint) {
    const batch = this.batches.get(endpoint);
    if (!batch || batch.requests.length === 0) return;
    
    const requests = batch.requests.slice();
    batch.requests = [];
    batch.timer = null;
    
    try {
      const ids = requests.map(req => req.id);
      const response = await httpClient.post(`${endpoint}/batch`, { ids });
      
      // Resolve individual requests
      requests.forEach(request => {
        const result = response.data.find(item => item.id === request.id);
        if (result) {
          request.resolve(result);
        } else {
          request.reject(new Error('Item not found in batch response'));
        }
      });
    } catch (error) {
      // Reject all requests
      requests.forEach(request => {
        request.reject(error);
      });
    }
  }
}

export const requestBatcher = new RequestBatcher();
```

---

## Next Steps

- **[Security Guide]({{ site.baseurl }}/docs/security/)** - Implement security best practices
- **[Testing Guide]({{ site.baseurl }}/docs/testing/)** - Test your API integrations
- **[Monitoring Guide]({{ site.baseurl }}/docs/monitoring/)** - Monitor API performance

---

{: .highlight }
💡 **Pro Tip**: Always implement proper error handling and retry logic for API calls. Use caching strategically to reduce API load and improve user experience. 