import Meli from '../src/index';

const meliObject = new Meli();


const examples = [
    'Get categories from mercado libre argentina',
    'Get users/77169310',
    'Get users?ids=[n,n]'
];

const printOptions = () => {
    console.log('Choose a number');
    examples.forEach((e, i) => {
        console.log(`${i + 1}: ${e}`);
    });
};

printOptions();
const stdin = process.openStdin();
stdin.addListener('data', digit => {
    // const end = d.toString();
    const d = parseInt(digit, 10);
    if (d === 1) {
        meliObject.get('sites/MLA/categories', (err, res) => {
            console.log(err, res);
        });
    } else if (d === 2) {
        meliObject.get('users/77169310', (err, res) => {
            console.log(err, res);
        });
    } else if (d === 3) {
        meliObject.get('users?ids=145925943,145925951', {
        }, (err, res) => {
            console.log(err, res);
        });
    } else {
        console.log('Halt!');
        process.exit('SUCESSS');
    }
});

