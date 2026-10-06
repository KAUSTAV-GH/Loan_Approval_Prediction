import { API_BASE_URL } from './constants.js';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function predictLoan(applicationData) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      let errorMessage = 'Prediction failed';
      let errorData = null;

      try {
        const errorResponse = await response.json();
        errorMessage = errorResponse.detail || errorResponse.message || errorMessage;
        errorData = errorResponse;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      throw new ApiError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('Network error occurred', 0, { originalError: error.message });
  }
}

// Health check
export async function healthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new ApiError('Health check failed', response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('Health check network error', 0, { originalError: error.message });
  }
}

export async function downloadPredictionReport(reportData) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/report/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
  } catch (error) {
    throw new ApiError('Network error occurred while creating the report', 0, { originalError: error.message });
  }

  if (!response.ok) {
    let errorMessage = 'Could not create the PDF report';
    let errorData = null;

    try {
      errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }

    throw new ApiError(errorMessage, response.status, errorData);
  }

  const contentType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (contentType !== 'application/pdf') {
    throw new ApiError('The report service did not return a PDF file', response.status);
  }

  const blob = await response.blob();
  const signature = new TextDecoder().decode(await blob.slice(0, 5).arrayBuffer());
  if (signature !== '%PDF-') {
    throw new ApiError('The report response is not a valid PDF file', response.status);
  }

  return blob;
}
