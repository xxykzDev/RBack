const express = require('express');
const Web3 = require('web3');
const app = express();
const DAO = require('./abi.json');
const cors = require('cors'); // Importa el paquete cors

app.use(cors()); // Agrega el middleware de CORS

const infuraEndpoint = 'https://sepolia.infura.io/v3/6ad32fe8f2d64de4b501ab527cc49740';
const provider = new Web3.providers.HttpProvider(infuraEndpoint);

const web3 = new Web3(provider);

const daoContractAddress = '0xe0f49611233443Db3F6512E24776CFA18C986781';
const daoContract = new web3.eth.Contract(DAO.abi, daoContractAddress);

app.get('/proposals', async (req, res) => {
    const nextProposalId = await daoContract.methods.nextProposalId().call();
    console.log(nextProposalId)
    const proposals = [];
    for (let i = 0; i <= nextProposalId -1; i++) {
        const proposal = await daoContract.methods.proposals(i).call();
        const currentTime = Math.floor(Date.now() / 1000);
        const timeRemaining = proposal.deadline - currentTime;
        const formattedProposal = {
            id: Number(proposal.id),
            title: proposal.title,
            description: proposal.description,
            optionAText: proposal.optionAText,
            optionBText: proposal.optionBText,
            deadline: Number(proposal.deadline),
            minimumVotes: Number(proposal.minimumVotes),
            optionA: Number(proposal.optionA),
            optionB: Number(proposal.optionB),
            executed: proposal.executed,
            winningOption: Number(proposal.winningOption),
            timeRemaining: timeRemaining + ' segundos',
            timeRemainingFront: timeRemaining
        };
      
        proposals.push(formattedProposal);
    }
    res.send(proposals);
});
  
app.listen(3000, () => {
    console.log(`Backend escuchando en el puerto 3000`);
});
