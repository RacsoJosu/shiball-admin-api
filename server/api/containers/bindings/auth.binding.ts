import { Container } from 'inversify';
import { AuthController } from '../../auth/auth.controller';
import { TYPES_AUTH } from '../../auth/auth.types';


export function bindAuthModule(container: Container) {
    container.bind<AuthController>(TYPES_AUTH.AuthController).to(AuthController).inRequestScope();
    
}
