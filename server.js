//const { Request } = require('node:http')
const http = require('node:http')
//const { json } = require('stream/consumers')
const PORT = 3333

const participantes = []

const server = http.createServer((Request, Response) => {
    const{method, url} = Request

    if(url === "/participants" && method === "POST"){
     
        let body = ""
        Request.on("data", (chunk)=>{
            body += chunk.toString()
        })
        
        Request.on("end", ()=>{
            const novoUsuario = JSON.parse(body)

            if(novoUsuario.idade >= 16 ){
                novoUsuario.id = participantes.length + 1

                participantes.push(novoUsuario)

                Response.writeHead(201, {"Content-Type": "application/json"})
                Response.end(JSON.stringify(novoUsuario))
                }else{
                    Response.writeHead(401, {"Content-Type": "application/json"})
                    Response.end(JSON.stringify({message: "Não permitido!, tem que ser ter idade ou maior que 16!"}))
                }    
        })
    }

    else if(url === "/participants/count/over18" && method === "GET"){
        const count = participantes.filter((participante)=> participante.idade >= 18).length

        Response.setHeader("Content-Type", "application/json")
        Response.end(JSON.stringify({Quantidade: count}))
    }

    else if(url === "/participants/count" && method === "GET"){
        const count = participantes.length
        
        Response.setHeader("Content-type", "application/json")
        Response.end(JSON.stringify({Quantidade: count}))
    }
    else if(url.startsWith("/participants/") && method === "GET"){
        const participanteId = url.split("/")[2]
        const participantePeloId = participantes.find((participante)=> participante.id == participanteId)

        if(participantePeloId){
            Response.setHeader("Content-Type", "application/json")
            Response.end(JSON.stringify(participantePeloId))
        }else{
            Response.writeHead(404, {"Content-Type": "application/json"})
            Response.end(JSON.stringify({message: "Usuário não encontrado"}))
        }
    }
    else if(url.startsWith("/participants/") && method === "PUT"){
        const userId = url.split("/")[2]
        const participantePeloId = participantes.find((participante)=> participante.id == userId)

        if(participantePeloId){
            let body = ''
            Request.on("data", (chunk)=>{
                body += chunk.toString()
            })

            Request.on("end", ()=>{
                const atualizacaoUsuario = JSON.parse(body)

                const index = participantes.findIndex((participante)=> participante.id == userId)
                if(index !== -1){
                    if(atualizacaoUsuario.idade >= 16){
                    participantes[index] = {...participantes[index], atualizacaoUsuario}
                Response.setHeader("Content-Type", "application/json")
                Response.end(JSON.stringify(participantes[index]))
                    }else{
                    Response.writeHead(404, {"Content-Type": "application/json"})
                    Response.end(JSON.stringify({message: "Usuário precisa ter idade maior ou igual a 16 anos"}))
                    }
                    
                }else{
                    Response.writeHead(404, {"Content-Type": "application/json"})
                    Response.end(JSON.stringify({message: "Usuário não encontrado"}))
                }
            })
        }
    }
    else if(url.startsWith("/participants/") && method === "DELETE"){
        const userId = url.split("/")[2]

        const index = participantes.findIndex((participante)=> participante.id == userId)

                if(index !== -1){
                    participantes.splice(index, 1)
                Response.setHeader("Content-Type", "application/json")
                Response.end(JSON.stringify({message: "Usuário deletado!"}))
        }else{
            Response.writeHead(404, {"Content-Type": "application/json"})
            Response.end(JSON.stringify({message: "Usuário não encontrado"}))
        }
        
    } else if(url === '/participants' && method === "GET"){
        Response.setHeader("Content-Type", "application/json")
        Response.end(JSON.stringify(participantes))
    }

    else{
        Response.writeHead(404, {"Content-Type": "application/json"})
        Response.end(JSON.stringify({message: "Página não encontrada"}))
    }
})
server.listen(PORT,()=>{
    console.log(`servidor on PORT: ${PORT}`)
})