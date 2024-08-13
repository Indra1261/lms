const {PrismaClient} = require("@prisma/client");

const database=new PrismaClient();

async function main() {
    try {
        await database.catagory.createMany({
            data:[
                {name:"11th"},
                {name:"12th"},
                {name:"Dropper"},
                
            ]
        })
        console.log("success");
        

    } catch (error) {
        console.log("Error seeding the database catagories",error);
        
    }
}

main();