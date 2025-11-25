import { POST } from '@/app/api/export/docx/route';

// Mock de html-docx-js (si lo usas) o similar
jest.mock('html-docx-js', () => ({
  asBlob: jest.fn((html) => Promise.resolve(new Blob(['fake docx'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }))),
}));

describe('API /api/export/docx', () => {
  const mockRequest = (body) => ({
    json: () => Promise.resolve(body),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe generar DOCX exitosamente', async () => {
    const request = mockRequest({
      html: '<html><body>Test CV</body></html>'
    });

    const response = await POST(request);
    
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
  });

  test('debe retornar Content-Type correcto para DOCX', async () => {
    const request = mockRequest({
      html: '<html><body>Test</body></html>'
    });

    const response = await POST(request);
    
    const contentType = response.headers.get('Content-Type');
    expect(contentType).toContain('application/') || expect(contentType).toContain('word');
  });

  test('debe retornar error 400 si falta HTML', async () => {
    const request = mockRequest({});

    const response = await POST(request);
    
    expect(response.status).toBe(400);
  });

  test('debe incluir header de disposición para descarga', async () => {
    const request = mockRequest({
      html: '<html><body>Test</body></html>'
    });

    const response = await POST(request);
    
    const disposition = response.headers.get('Content-Disposition');
    expect(disposition).toContain('attachment');
    expect(disposition).toContain('.docx') || expect(disposition).toContain('.rtf');
  });
});
