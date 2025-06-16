module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",    
      port: 7545,            
      network_id: "*",       
    },
  },

  // Opciones para mocha
  mocha: {
    // timeout: 100000
  },

  // Configuración del compilador Solidity
  compilers: {
    solc: {
      version: "0.8.21",      
      // docker: true,
      // settings: {
      //   optimizer: {
      //     enabled: false,
      //     runs: 200
      //   },
      //   evmVersion: "byzantium"
      // }
    }
  },

  // Configuración para Truffle DB (opcional)
  // db: {
  //   enabled: false,
  //   host: "127.0.0.1",
  //   adapter: {
  //     name: "indexeddb",
  //     settings: {
  //       directory: ".db"
  //     }
  //   }
  // }
};
