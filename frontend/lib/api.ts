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
  register: (data: any) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Books
  getBooks: () => apiCall('/books'),
  getBook: (id: number) => apiCall(`/books/${id}`),
  createBook: (data: any) =>
    apiCall('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Reading Progress
  getReadingProgress: () => apiCall('/reading-progress'),
  updateReadingProgress: (id: number, data: any) =>
    apiCall(`/reading-progress/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Rewards
  getRewards: () => apiCall('/rewards'),
  redeemReward: (id: number) =>
    apiCall(`/rewards/${id}/redeem`, { method: 'POST' }),

  // Quizzes
  getQuizzes: (bookId: number) => apiCall(`/quizzes?book_id=${bookId}`),
  submitQuizAttempt: (data: any) =>
    apiCall('/quiz-attempts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
