import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
    try {
        const adminData = {
            name: "Admin1 Saheb",
            email: "admin201@gmail.com",
            role: UserRole.ADMIN,
            password: "admin1234"
        }

        // check user exist on db or not
        const existingUser = await prisma.user.findUnique({
            where:{
                email: adminData.email
            }
        })

        if(existingUser){
            throw new Error("User already exists!!")
        }

        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(adminData)
        })

        if(signUpAdmin.ok){
            console.log("Admin user created successfully")
            await prisma.user.update({
                where:{
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })
            console.log('*****Email verification status updated')
        }
        console.log("****   Success ********")
    } catch (error) {
        console.error(error)
    }
}

seedAdmin()