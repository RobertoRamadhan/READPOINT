const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

console.log('[API] Initialized with URL:', API_URL);

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  console.log(`[API] ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Include cookies for Sanctum
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    let data;
    try {
      data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.warn('[API] Failed to parse JSON response');
      data = { message: `HTTP ${response.status}` };
    }

    console.log(`[API] Response (${response.status}):`, data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: API Error`);
    }

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error or server is unreachable';
    console.error('[API] Error:', errorMessage);
    throw new Error(errorMessage);
  }
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => apiCall('/auth/logout', { method: 'POST' }),
  register: (data: unknown) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Books
  getBooks: () => apiCall('/books'),
  getBook: (id: number) => apiCall(`/books/${id}`),
  createBook: (data: unknown) =>
    apiCall('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // E-Books
  getEbooks: () => apiCall('/ebooks'),
  getEbook: (id: number) => apiCall(`/ebooks/${id}`),
  createEbook: (data: FormData) =>
    fetch(`${API_URL}/ebooks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : null}`,
      },
      body: data,
    }).then(r => r.json()),

  // Reading Progress
  getReadingProgress: () => apiCall('/reading-progress'),
  updateReadingProgress: (id: number, data: unknown) =>
    apiCall(`/reading-progress/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Reading Activities
  startReading: (ebookId: number) =>
    apiCall('/reading-activities/start', {
      method: 'POST',
      body: JSON.stringify({ ebook_id: ebookId }),
    }),
  updateActivityProgress: (activityId: number, data: unknown) =>
    apiCall(`/reading-activities/${activityId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  completeReading: (activityId: number, data: unknown) =>
    apiCall(`/reading-activities/${activityId}/complete`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getMyActivities: () => apiCall('/reading-activities'),

  // Quizzes
  getQuizzes: (bookId: number) => apiCall(`/ebooks/${bookId}/quiz`),
  submitQuiz: (data: unknown) =>
    apiCall('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMyQuizAttempts: () => apiCall('/quiz/my-attempts'),

  // Rewards

  // Dashboard - Admin
  dashboard: {
    adminStats: () => apiCall('/dashboard/admin/stats'),
    adminTopStudents: () => apiCall('/dashboard/admin/top-students'),
    adminBooks: () => apiCall('/dashboard/admin/books'),
    adminUsersStats: () => apiCall('/dashboard/admin/users-stats'),
    
    // Guru
    guruStats: () => apiCall('/dashboard/guru/stats'),
    guruStudents: () => apiCall('/dashboard/guru/students'),
    
    // Siswa
    siswaStats: () => apiCall('/dashboard/siswa/stats'),
    siswaBooks: () => apiCall('/dashboard/siswa/books'),
    siswaPointsHistory: () => apiCall('/dashboard/siswa/points-history'),
  },

  // E-Books (Admin CRUD)
  ebooks: {
    list: () => apiCall('/ebooks'),
    get: (id: number) => apiCall(`/ebooks/${id}`),
    create: (data: unknown) =>
      apiCall('/ebooks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: unknown) =>
      apiCall(`/ebooks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      apiCall(`/ebooks/${id}`, {
        method: 'DELETE',
      }),
  },

  // Rewards (Admin CRUD)
  rewards: {
    list: () => apiCall('/rewards'),
    get: (id: number) => apiCall(`/rewards/${id}`),
    create: (data: unknown) =>
      apiCall('/rewards', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: unknown) =>
      apiCall(`/rewards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      apiCall(`/rewards/${id}`, {
        method: 'DELETE',
      }),
    redeem: (id: number, quantity: number = 1) =>
      apiCall(`/rewards/${id}/redeem`, {
        method: 'POST',
        body: JSON.stringify({ quantity }),
      }),
    getMyRedemptions: () => apiCall('/my-redemptions'),
    getUserPoints: () => apiCall('/user-points'),
  },

  // Users (Admin only)
  users: {
    getAll: (role?: string) => apiCall(`/users${role ? `?role=${role}` : ''}`),
    get: (id: number) => apiCall(`/users/${id}`),
    create: (data: unknown) =>
      apiCall('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: unknown) =>
      apiCall(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      apiCall(`/users/${id}`, {
        method: 'DELETE',
      }),
    resetPassword: (id: number, password: string) =>
      apiCall(`/users/${id}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ password, password_confirmation: password }),
      }),
  },
};
