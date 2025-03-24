import { UserRepository } from "../auth/auth.repository";

export class UserService {
    constructor(private userRepository: UserRepository) { }
    
    async getAll(search?:string) {
        return await this.userRepository.findAll(search)
    }
}