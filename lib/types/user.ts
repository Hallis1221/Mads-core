export type User = {
    // The users email
    email: string;

    // The users id, nullable
    id: string | null;

    // The users display name, nullable
    name: string | null;

    // Could circle
    user: User;
}