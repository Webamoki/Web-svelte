import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock global fetch and DOMParser
const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

// Mock DOMParser for XML parsing
const mockDOMParser = vi.fn(() => ({
  parseFromString: vi.fn((xmlString: string) => {
    // Simple mock XML parser for testing
    const messageIdMatch = xmlString.match(/<MessageId>(.*?)<\/MessageId>/);
    const errorCodeMatch = xmlString.match(/<Code>(.*?)<\/Code>/);
    const errorMessageMatch = xmlString.match(/<Message>(.*?)<\/Message>/);

    return {
      querySelector: (selector: string) => {
        if (selector === 'MessageId' && messageIdMatch) {
          return { textContent: messageIdMatch[1] };
        }
        if (selector === 'Error' && (errorCodeMatch || errorMessageMatch)) {
          return {
            querySelector: (innerSelector: string) => {
              if (innerSelector === 'Code' && errorCodeMatch) {
                return { textContent: errorCodeMatch[1] };
              }
              if (innerSelector === 'Message' && errorMessageMatch) {
                return { textContent: errorMessageMatch[1] };
              }
              return null;
            }
          };
        }
        return null;
      }
    };
  })
}));
global.DOMParser = mockDOMParser as unknown as typeof DOMParser;

// Import after mocking
import { sendEmail } from './ses.js';

const testAwsCredentials = {
  awsAccessKeyId: 'test-access-key',
  awsRegion: 'us-east-1',
  awsSecretAccessKey: 'test-secret-key'
};

describe('sendEmail', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should throw error if options is not provided', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect(sendEmail(null as any)).rejects.toThrow('sendEmail: options is required');
  });

  it('should throw error if "to" field is missing', async () => {
    await expect(
      sendEmail({
        from: 'sender@example.com',
        subject: 'Test',
        text: 'Test message',
        ...testAwsCredentials
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
    ).rejects.toThrow('at least one valid recipient is required');
  });

  it('should throw error if "to" field is empty string', async () => {
    await expect(
      sendEmail({
        from: 'sender@example.com',
        subject: 'Test',
        text: 'Test message',
        to: '   ',
        ...testAwsCredentials
      })
    ).rejects.toThrow('at least one valid recipient is required');
  });

  it('should throw error if "to" field is empty array', async () => {
    await expect(
      sendEmail({
        from: 'sender@example.com',
        subject: 'Test',
        text: 'Test message',
        to: [],
        ...testAwsCredentials
      })
    ).rejects.toThrow('at least one valid recipient is required');
  });

  it('should throw error if "to" field contains only empty strings', async () => {
    await expect(
      sendEmail({
        from: 'sender@example.com',
        subject: 'Test',
        text: 'Test message',
        to: ['', '   ', ''],
        ...testAwsCredentials
      })
    ).rejects.toThrow('at least one valid recipient is required');
  });

  it('should filter out empty strings from "to" array and accept valid emails', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () =>
        '<SendEmailResponse><MessageId>test-message-id</MessageId></SendEmailResponse>'
    });

    await sendEmail({
      from: 'sender@example.com',
      subject: 'Test',
      text: 'Test message',
      to: ['', 'valid@example.com', '   ', 'another@example.com'],
      ...testAwsCredentials
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchCall = mockFetch.mock.calls[0];
    const body = fetchCall[1].body as string;
    expect(body).toContain('Destination.ToAddresses.member.1=valid%40example.com');
    expect(body).toContain('Destination.ToAddresses.member.2=another%40example.com');
  });

  it('should filter out empty strings from cc and bcc arrays', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () =>
        '<SendEmailResponse><MessageId>test-message-id</MessageId></SendEmailResponse>'
    });

    await sendEmail({
      bcc: ['  ', 'bcc@example.com'],
      cc: ['', 'cc@example.com', '  '],
      from: 'sender@example.com',
      subject: 'Test',
      text: 'Test message',
      to: 'test@example.com',
      ...testAwsCredentials
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchCall = mockFetch.mock.calls[0];
    const body = fetchCall[1].body as string;
    expect(body).toContain('Destination.CcAddresses.member.1=cc%40example.com');
    expect(body).toContain('Destination.BccAddresses.member.1=bcc%40example.com');
  });

  it('should omit cc/bcc if all values are empty strings', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () =>
        '<SendEmailResponse><MessageId>test-message-id</MessageId></SendEmailResponse>'
    });

    await sendEmail({
      bcc: ['   '],
      cc: ['', '  '],
      from: 'sender@example.com',
      subject: 'Test',
      text: 'Test message',
      to: 'test@example.com',
      ...testAwsCredentials
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchCall = mockFetch.mock.calls[0];
    const body = fetchCall[1].body as string;
    expect(body).not.toContain('Destination.CcAddresses');
    expect(body).not.toContain('Destination.BccAddresses');
  });

  it('should throw error if subject is missing', async () => {
    await expect(
      sendEmail({
        text: 'Test message',
        to: 'test@example.com',
        ...testAwsCredentials
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
    ).rejects.toThrow('subject is required');
  });

  it('should throw error if both text and html are missing', async () => {
    await expect(
      sendEmail({
        subject: 'Test',
        to: 'test@example.com',
        ...testAwsCredentials
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
    ).rejects.toThrow('at least one of text or html body must be provided');
  });

  it('should throw error if from is not provided', async () => {
    await expect(
      sendEmail({
        subject: 'Test',
        text: 'Test message',
        to: 'test@example.com',
        ...testAwsCredentials
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
    ).rejects.toThrow('sender `from` is required');
  });

  it('should accept single recipient as string', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () =>
        '<SendEmailResponse><MessageId>test-message-id</MessageId></SendEmailResponse>'
    });

    await sendEmail({
      from: 'sender@example.com',
      subject: 'Test',
      text: 'Test message',
      to: 'test@example.com',
      ...testAwsCredentials
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should accept multiple recipients as array', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () =>
        '<SendEmailResponse><MessageId>test-message-id</MessageId></SendEmailResponse>'
    });

    await sendEmail({
      from: 'sender@example.com',
      subject: 'Test',
      text: 'Test message',
      to: ['test1@example.com', 'test2@example.com'],
      ...testAwsCredentials
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should format source with fromName when provided', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () =>
        '<SendEmailResponse><MessageId>test-message-id</MessageId></SendEmailResponse>'
    });

    await sendEmail({
      from: 'sender@example.com',
      fromName: 'Test Sender',
      subject: 'Test',
      text: 'Test message',
      to: 'test@example.com',
      ...testAwsCredentials
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchCall = mockFetch.mock.calls[0];
    const body = fetchCall[1].body as string;
    expect(body).toContain('Source=Test+Sender+%3Csender%40example.com%3E');
  });

  it('should handle CC and BCC recipients', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () =>
        '<SendEmailResponse><MessageId>test-message-id</MessageId></SendEmailResponse>'
    });

    await sendEmail({
      bcc: ['bcc1@example.com', 'bcc2@example.com'],
      cc: 'cc@example.com',
      from: 'sender@example.com',
      subject: 'Test',
      text: 'Test message',
      to: 'test@example.com',
      ...testAwsCredentials
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchCall = mockFetch.mock.calls[0];
    const body = fetchCall[1].body as string;
    expect(body).toContain('Destination.CcAddresses.member.1=cc%40example.com');
    expect(body).toContain('Destination.BccAddresses.member.1=bcc1%40example.com');
    expect(body).toContain('Destination.BccAddresses.member.2=bcc2%40example.com');
  });

  it('should include both HTML and text body when provided', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () =>
        '<SendEmailResponse><MessageId>test-message-id</MessageId></SendEmailResponse>'
    });

    await sendEmail({
      from: 'sender@example.com',
      html: '<p>HTML version</p>',
      subject: 'Test',
      text: 'Plain text version',
      to: 'test@example.com',
      ...testAwsCredentials
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchCall = mockFetch.mock.calls[0];
    const body = fetchCall[1].body as string;
    expect(body).toContain('Message.Body.Text.Data=Plain+text+version');
    expect(body).toContain('Message.Body.Html.Data=%3Cp%3EHTML+version%3C%2Fp%3E');
  });

  it('should return MessageId on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () =>
        '<SendEmailResponse><MessageId>test-message-id-123</MessageId></SendEmailResponse>'
    });

    const result = await sendEmail({
      from: 'sender@example.com',
      subject: 'Test',
      text: 'Test message',
      to: 'test@example.com',
      ...testAwsCredentials
    });

    expect(result).toBe('test-message-id-123');
  });

  it('should throw error when SES response is missing MessageId', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () => '<SendEmailResponse></SendEmailResponse>'
    });

    await expect(
      sendEmail({
        from: 'sender@example.com',
        subject: 'Test',
        text: 'Test message',
        to: 'test@example.com',
        ...testAwsCredentials
      })
    ).rejects.toThrow('SES response did not contain a MessageId');
  });

  it('should handle SES errors gracefully', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () =>
        '<ErrorResponse><Error><Code>MessageRejected</Code><Message>Email address is not verified</Message></Error></ErrorResponse>'
    });

    await expect(
      sendEmail({
        from: 'sender@example.com',
        subject: 'Test',
        text: 'Test message',
        to: 'test@example.com',
        ...testAwsCredentials
      })
    ).rejects.toThrow(/failed to send email/);
  });

  it('should handle reply-to addresses', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () =>
        '<SendEmailResponse><MessageId>test-message-id</MessageId></SendEmailResponse>'
    });

    await sendEmail({
      from: 'sender@example.com',
      replyTo: 'reply@example.com',
      subject: 'Test',
      text: 'Test message',
      to: 'test@example.com',
      ...testAwsCredentials
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchCall = mockFetch.mock.calls[0];
    const body = fetchCall[1].body as string;
    expect(body).toContain('ReplyToAddresses.member.1=reply%40example.com');
  });

  it('should handle multiple reply-to addresses', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () =>
        '<SendEmailResponse><MessageId>test-message-id</MessageId></SendEmailResponse>'
    });

    await sendEmail({
      from: 'sender@example.com',
      replyTo: ['reply1@example.com', 'reply2@example.com'],
      subject: 'Test',
      text: 'Test message',
      to: 'test@example.com',
      ...testAwsCredentials
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchCall = mockFetch.mock.calls[0];
    const body = fetchCall[1].body as string;
    expect(body).toContain('ReplyToAddresses.member.1=reply1%40example.com');
    expect(body).toContain('ReplyToAddresses.member.2=reply2%40example.com');
  });
});
