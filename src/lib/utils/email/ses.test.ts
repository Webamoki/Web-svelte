import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock AWS SES Client before importing the module
const mockSend = vi.hoisted(() => vi.fn());
vi.mock('@aws-sdk/client-ses', () => {
	return {
		SESClient: vi.fn(() => ({
			send: mockSend
		})),
		SendEmailCommand: vi.fn((params) => params)
	};
});

// Import after mocking
import { sendEmail } from './ses.js';

describe('sendEmail', () => {
	beforeEach(() => {
		mockSend.mockClear();
		// Set up default environment variables
		process.env.AWS_REGION = 'us-east-1';
	});

	it('should throw error if options is not provided', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await expect(sendEmail(null as any)).rejects.toThrow('sendEmail: options is required');
	});

	it('should throw error if "to" field is missing', async () => {
		await expect(
			sendEmail({
				subject: 'Test',
				text: 'Test message',
				from: 'sender@example.com'
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any)
		).rejects.toThrow('at least one valid recipient is required');
	});

	it('should throw error if "to" field is empty string', async () => {
		await expect(
			sendEmail({
				to: '   ',
				subject: 'Test',
				text: 'Test message',
				from: 'sender@example.com'
			})
		).rejects.toThrow('at least one valid recipient is required');
	});

	it('should throw error if "to" field is empty array', async () => {
		await expect(
			sendEmail({
				to: [],
				subject: 'Test',
				text: 'Test message',
				from: 'sender@example.com'
			})
		).rejects.toThrow('at least one valid recipient is required');
	});

	it('should throw error if "to" field contains only empty strings', async () => {
		await expect(
			sendEmail({
				to: ['', '   ', ''],
				subject: 'Test',
				text: 'Test message',
				from: 'sender@example.com'
			})
		).rejects.toThrow('at least one valid recipient is required');
	});

	it('should filter out empty strings from "to" array and accept valid emails', async () => {
		const { SendEmailCommand } = await import('@aws-sdk/client-ses');
		mockSend.mockResolvedValue({ MessageId: 'test-message-id' });

		await sendEmail({
			to: ['', 'valid@example.com', '   ', 'another@example.com'],
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com'
		});

		expect(SendEmailCommand).toHaveBeenCalledWith(
			expect.objectContaining({
				Destination: expect.objectContaining({
					ToAddresses: ['valid@example.com', 'another@example.com']
				})
			})
		);
	});

	it('should filter out empty strings from cc and bcc arrays', async () => {
		const { SendEmailCommand } = await import('@aws-sdk/client-ses');
		mockSend.mockResolvedValue({ MessageId: 'test-message-id' });

		await sendEmail({
			to: 'test@example.com',
			cc: ['', 'cc@example.com', '  '],
			bcc: ['  ', 'bcc@example.com'],
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com'
		});

		expect(SendEmailCommand).toHaveBeenCalledWith(
			expect.objectContaining({
				Destination: expect.objectContaining({
					CcAddresses: ['cc@example.com'],
					BccAddresses: ['bcc@example.com']
				})
			})
		);
	});

	it('should omit cc/bcc if all values are empty strings', async () => {
		const { SendEmailCommand } = await import('@aws-sdk/client-ses');
		mockSend.mockResolvedValue({ MessageId: 'test-message-id' });

		await sendEmail({
			to: 'test@example.com',
			cc: ['', '  '],
			bcc: ['   '],
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com'
		});

		expect(SendEmailCommand).toHaveBeenCalledWith(
			expect.objectContaining({
				Destination: expect.objectContaining({
					ToAddresses: ['test@example.com'],
					CcAddresses: undefined,
					BccAddresses: undefined
				})
			})
		);
	});

	it('should throw error if subject is missing', async () => {
		await expect(
			sendEmail({
				to: 'test@example.com',
				text: 'Test message'
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any)
		).rejects.toThrow('subject is required');
	});

	it('should throw error if both text and html are missing', async () => {
		await expect(
			sendEmail({
				to: 'test@example.com',
				subject: 'Test'
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any)
		).rejects.toThrow('at least one of text or html body must be provided');
	});

	it('should throw error if from is not provided', async () => {
		await expect(
			sendEmail({
				to: 'test@example.com',
				subject: 'Test',
				text: 'Test message'
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any)
		).rejects.toThrow('sender `from` is required');
	});

	it('should accept single recipient as string', async () => {
		mockSend.mockResolvedValue({ MessageId: 'test-message-id' });

		await sendEmail({
			to: 'test@example.com',
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com'
		});

		expect(mockSend).toHaveBeenCalledTimes(1);
	});

	it('should accept multiple recipients as array', async () => {
		mockSend.mockResolvedValue({ MessageId: 'test-message-id' });

		await sendEmail({
			to: ['test1@example.com', 'test2@example.com'],
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com'
		});

		expect(mockSend).toHaveBeenCalledTimes(1);
	});

	it('should format source with fromName when provided', async () => {
		const { SendEmailCommand } = await import('@aws-sdk/client-ses');
		mockSend.mockResolvedValue({ MessageId: 'test-message-id' });

		await sendEmail({
			to: 'test@example.com',
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com',
			fromName: 'Test Sender'
		});

		expect(SendEmailCommand).toHaveBeenCalledWith(
			expect.objectContaining({
				Source: 'Test Sender <sender@example.com>'
			})
		);
	});

	it('should handle CC and BCC recipients', async () => {
		const { SendEmailCommand } = await import('@aws-sdk/client-ses');
		mockSend.mockResolvedValue({ MessageId: 'test-message-id' });

		await sendEmail({
			to: 'test@example.com',
			cc: 'cc@example.com',
			bcc: ['bcc1@example.com', 'bcc2@example.com'],
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com'
		});

		expect(SendEmailCommand).toHaveBeenCalledWith(
			expect.objectContaining({
				Destination: expect.objectContaining({
					CcAddresses: ['cc@example.com'],
					BccAddresses: ['bcc1@example.com', 'bcc2@example.com']
				})
			})
		);
	});

	it('should include both HTML and text body when provided', async () => {
		const { SendEmailCommand } = await import('@aws-sdk/client-ses');
		mockSend.mockResolvedValue({ MessageId: 'test-message-id' });

		await sendEmail({
			to: 'test@example.com',
			subject: 'Test',
			text: 'Plain text version',
			html: '<p>HTML version</p>',
			from: 'sender@example.com'
		});

		expect(SendEmailCommand).toHaveBeenCalledWith(
			expect.objectContaining({
				Message: expect.objectContaining({
					Body: expect.objectContaining({
						Text: expect.objectContaining({
							Data: 'Plain text version'
						}),
						Html: expect.objectContaining({
							Data: '<p>HTML version</p>'
						})
					})
				})
			})
		);
	});

	it('should return MessageId on success', async () => {
		mockSend.mockResolvedValue({ MessageId: 'test-message-id-123' });

		const result = await sendEmail({
			to: 'test@example.com',
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com'
		});

		expect(result).toBe('test-message-id-123');
	});

	it('should throw error when SES response is missing MessageId', async () => {
		mockSend.mockResolvedValue({}); // No MessageId in response

		await expect(
			sendEmail({
				to: 'test@example.com',
				subject: 'Test',
				text: 'Test message',
				from: 'sender@example.com'
			})
		).rejects.toThrow('SES response did not contain a MessageId');
	});

	it('should handle SES errors gracefully', async () => {
		const mockError = new Error('SES Service Error');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(mockError as any).name = 'MessageRejected';
		mockSend.mockRejectedValue(mockError);

		await expect(
			sendEmail({
				to: 'test@example.com',
				subject: 'Test',
				text: 'Test message',
				from: 'sender@example.com'
			})
		).rejects.toThrow(/failed to send email/);
	});

	it('should handle reply-to addresses', async () => {
		const { SendEmailCommand } = await import('@aws-sdk/client-ses');
		mockSend.mockResolvedValue({ MessageId: 'test-message-id' });

		await sendEmail({
			to: 'test@example.com',
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com',
			replyTo: 'reply@example.com'
		});

		expect(SendEmailCommand).toHaveBeenCalledWith(
			expect.objectContaining({
				ReplyToAddresses: ['reply@example.com']
			})
		);
	});

	it('should handle multiple reply-to addresses', async () => {
		const { SendEmailCommand } = await import('@aws-sdk/client-ses');
		mockSend.mockResolvedValue({ MessageId: 'test-message-id' });

		await sendEmail({
			to: 'test@example.com',
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com',
			replyTo: ['reply1@example.com', 'reply2@example.com']
		});

		expect(SendEmailCommand).toHaveBeenCalledWith(
			expect.objectContaining({
				ReplyToAddresses: ['reply1@example.com', 'reply2@example.com']
			})
		);
	});
});
