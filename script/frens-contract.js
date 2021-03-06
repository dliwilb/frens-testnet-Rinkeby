// let isGettingTokenOwner = false;

const nftContractAddress = '0x69F511EAca22eD5c5f48ba3d5D3D0442340948c9'; // v2.2

async function readContractStatVar(){
    console.log('Reading contract state variables...');
    document.getElementById('list-contract-info').innerHTML = 'Loading...';

    // await connectWallet();
    // await switchNetwork();

    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    const provider = new ethers.providers.JsonRpcProvider('https://rinkeby-light.eth.linkpool.io/');
    const nftContract = new ethers.Contract(nftContractAddress, frensAbi, provider);

    let listContent = '';
    // const nft_tokenIds = await nftContract._tokenIds();
    // console.log(Number(nft_tokenIds));

    listContent += "<li>_tokenIds: " + await nftContract._tokenIds() + "</li>"; 
    listContent += "<li>isAddUserAllowed: " + await nftContract.isAddUserAllowed() + "</li>";
    const mintFeeWei = await nftContract.mintFee();
    listContent += "<li>mintFee: " + mintFeeWei + ` wei (${mintFeeWei*1e-18} ether)</li>`;
    const whitelistFeeWei = await nftContract.whitelistFee()
    listContent += "<li>whitelistFee: " + whitelistFeeWei + ` wei (${whitelistFeeWei*1e-18} ether)</li>`;
    listContent += "<li>whitelistWaiver: " + await nftContract.whitelistWaiver() + "</li>";
    listContent += "<li>name: " + await nftContract.name() + "</li>";
    listContent += "<li>symbol: " + await nftContract.symbol() + "</li>";
    listContent += "<li>nftNameSymbolHardcoded: " + await nftContract.nftNameSymbolHardcoded() + "</li>";
    listContent += "<li>owner: " + await nftContract.owner() + "</li>";
    listContent += "<li>treasuryAddress: " + await nftContract.treasuryAddress() + "</li>";


    document.getElementById('list-contract-info').innerHTML = listContent;

}

async function readWhitelisted() {
    console.log('Reading whitelisted addresses...');
    document.getElementById('list-whitelisted').innerHTML = 'Loading...';

    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const provider = new ethers.providers.JsonRpcProvider('https://rinkeby-light.eth.linkpool.io/');
    // const provider = ethers.getDefaultProvider(4);
    const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/2c1d58028d4343dbb2680897c28b8bc2');

    const blockNum = await provider.getBlockNumber();   
    const queryPeriodHour = 24;
    const queryPeriodBlock = queryPeriodHour * 60 * 60 / 5;
    const fromBlock = blockNum - queryPeriodBlock;
    const toBlock = blockNum;

    const nftContract = new ethers.Contract(nftContractAddress, frensAbi, provider);

    let listContent = '';

    const eventFilter = nftContract.filters.userAdded();
    const events = await nftContract.queryFilter(eventFilter, fromBlock, toBlock);

    for (let i = events.length-1; i >= 0; i--) {
        const newUser = events[i].args[0];
        const approvedBy = events[i].args[1];
        // console.log(newUser + " added by " + approvedBy);
        listContent += `<li>${newUser} (added by ${approvedBy})</li>`;
    }

    document.getElementById('list-whitelisted').innerHTML = listContent;


    // console.log("events: ");
    // console.log(events);

}

async function addUserWhitelistWaived() {

    if ( ethers.utils.isAddress(document.getElementById('address-to-be-whitelisted').value) ){

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(nftContractAddress, frensAbi, signer);
        
        let whitelistFee = await nftContract.whitelistFee();
        whitelistFee = Number(whitelistFee);
        console.log(whitelistFee);
        console.log(document.getElementById('address-to-be-whitelisted').value);

        await nftContract.addUserWhitelistWaived(
            document.getElementById('address-to-be-whitelisted').value, 
            { value: whitelistFee }
        ); 

    }

}

async function addUser() {

    if ( ethers.utils.isAddress(document.getElementById('address-to-be-whitelisted').value) ){

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(nftContractAddress, frensAbi, signer);
        
        let whitelistFee = await nftContract.whitelistFee();
        whitelistFee = Number(whitelistFee);
        console.log(whitelistFee);
        console.log(document.getElementById('address-to-be-whitelisted').value);

        await nftContract.addUser(
            document.getElementById('address-to-be-whitelisted').value, 
            { value: whitelistFee }
        ); 

    } else {
        document.getElementById('div-address-info').innerHTML = 'Please enter a valid address.';
    }

}

async function verifyUser() {

    if ( ethers.utils.isAddress(document.getElementById('address-to-be-whitelisted').value) ){

        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/2c1d58028d4343dbb2680897c28b8bc2');
        const nftContract = new ethers.Contract(nftContractAddress, frensAbi, provider);
        
        const isUserWhitelisted = await nftContract.verifyUser(document.getElementById('address-to-be-whitelisted').value); 
        document.getElementById('div-address-info').innerHTML = isUserWhitelisted;

    } else {
        document.getElementById('div-address-info').innerHTML = 'Please enter a valid address.';
    }

}

async function fetchJSON(api_uri) {
	let response = await fetch(api_uri);
	
	if (!response.ok) {
	    throw new Error(`HTTP error! status: ${response.status}`);
	}
	
	let myJSON = await response.json();
	
	return await myJSON;
}