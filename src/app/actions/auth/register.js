'use server'
import dbConnect, { collections } from '@/lib/dbConnect'
import bcrypt  from 'bcrypt';

export default async function register(userInfo) {
    const usersCollection = await dbConnect(collections.users);
    const email = userInfo.email;

    // check if users exists
    const isExists = await usersCollection.findOne({ email });
    if (isExists) {
        return ({ isSuccess: false, message: 'Users already Exists' });
    }

    // hashed password
    const hashedPassword = await bcrypt.hash(userInfo.password, 10);

    // final data
    const finalUserData = {
        ...userInfo,
        password: hashedPassword,
        registerAt: new Date().toISOString(),
        role: 'user',

    }

    // post in database
    const result = await usersCollection.insertOne(finalUserData);
    return ({ isSuccess: true, message: 'Sign Up Sucessfull' });
}
