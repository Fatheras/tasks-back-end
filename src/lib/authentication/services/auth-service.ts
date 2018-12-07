import passport from "passport";
import * as bcrypt from "bcrypt";
import { Strategy as localStrategy } from "passport-local";
import { User } from "../../user/models/user";
import UserService from "../../user/services/user-service";
import { Strategy as JWTstrategy } from "passport-jwt";
import { ExtractJwt as ExtractJWT } from "passport-jwt";
import { Role } from "../../user/models/roles";
import { Request } from "express";

export default class AuthService {
    public static setUpPassport(): void {
        AuthService.setSignUp();
        AuthService.setLogIn();
        AuthService.setCheckAccess();
    }

    public static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public static async isValidPassword(userPass: string, password: string): Promise<boolean> {
        return bcrypt.compare(password, userPass);
    }

    private static async setSignUp(): Promise<void> {
        passport.use("signup", new localStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        }, async (req: Request, email: string, password: string, done: any) => {
            try {
                const hashPass = await AuthService.hashPassword(password);
                await UserService.addUser({
                    email,
                    password: hashPass,
                    phone: req.body.phone,
                    role: Role.User,
                });

                return done(null);
            } catch (error) {
                return done(error);
            }
        }));
    }

    private static async setLogIn(): Promise<void> {
        passport.use("login", new localStrategy({
            usernameField: "email",
            passwordField: "password",
        }, async (email, password, done) => {
            try {
                const user = await User.findOne({ where: { email } });

                if (!user) {
                    return done(null, false, { message: "User not found" });
                }

                const validate = await AuthService.isValidPassword(user.password, password);

                if (!validate) {
                    return done(null, false, { message: "Wrong Password" });
                }

                return done(null, user, { message: "Logged in Successfully" });
            } catch (error) {
                return done(error);
            }
        }));
    }

    private static async setCheckAccess(): Promise<void> {
        passport.use(new JWTstrategy({
            secretOrKey: "top_secret",
            jwtFromRequest: ExtractJWT.fromAuthHeader(),
        }, async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }));
    }
}
