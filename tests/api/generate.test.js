import { POST } from '@/app/api/generate/route';

// Mock de puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn(() => Promise.resolve({
    newPage: jest.fn(() => Promise.resolve({
      setContent: jest.fn(),
      pdf: jest.fn(() => Promise.resolve(Buffer.from('fake pdf content'))),
      close: jest.fn(),
    })),
    close: jest.fn(),
  })),
}));

describe('API /api/generate', () => {
  const mockResume = {
    fullName: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+54 11 1234-5678',
    experience: [
      {
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Desarrollo web'
      }
    ],
    education: [],
    skills: ['JavaScript', 'React'],
  };

  const mockRequest = (body) => ({
    json: () => Promise.resolve(body),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe generar PDF exitosamente', async () => {
    const request = mockRequest({
      html: '<html><body>Test CV</body></html>'
    });

    const response = await POST(request);
    
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
  });

  test('debe retornar error 400 si falta HTML', async () => {
    const request = mockRequest({});

    const response = await POST(request);
    
    expect(response.status).toBe(400);
  });

  test('debe retornar Content-Type correcto para PDF', async () => {
    const request = mockRequest({
      html: '<html><body>Test</body></html>'
    });

    const response = await POST(request);
    
    const contentType = response.headers.get('Content-Type');
    expect(contentType).toBe('application/pdf');
  });

  test('debe manejar errores de puppeteer', async () => {
    const puppeteer = require('puppeteer');
    puppeteer.launch.mockRejectedValueOnce(new Error('Puppeteer error'));

    const request = mockRequest({
      html: '<html><body>Test</body></html>'
    });

    const response = await POST(request);
    
    expect(response.status).toBe(500);
  });

  test('debe cerrar el navegador después de generar PDF', async () => {
    const puppeteer = require('puppeteer');
    const mockClose = jest.fn();
    
    puppeteer.launch.mockResolvedValueOnce({
      newPage: jest.fn(() => Promise.resolve({
        setContent: jest.fn(),
        pdf: jest.fn(() => Promise.resolve(Buffer.from('pdf'))),
        close: jest.fn(),
      })),
      close: mockClose,
    });

    const request = mockRequest({
      html: '<html><body>Test</body></html>'
    });

    await POST(request);
    
    expect(mockClose).toHaveBeenCalled();
  });
});
