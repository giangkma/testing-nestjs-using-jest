export class MockAuthService {
    async hashPassword(password: string): Promise<string> {
        return `hashed_${password}`
    }

}
