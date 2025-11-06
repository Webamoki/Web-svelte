// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		namespace Superforms {
			type Message = {
				success: boolean;
				status: number;
				text?: string;
				showToast: boolean;
			};
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
