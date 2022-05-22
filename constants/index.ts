
  export interface Networks {
    [key: number]: string;
  }
  export const walletConnectSupportedNetworks: Networks = {
    // Add your network rpc URL here
    1: "https://ethereumnode.defiterm.io",
    3: "https://ethereumnode.defiterm-dev.net"
  };

  // Network chain ids
  export const supportedMetamaskNetworks = [1, 3, 4, 5, 42];
  //0x0B0e3CD328133065DD2a1B81c29D0e7E447c1Bce
  // export const ALBT_TOKEN_ADDRESS = "0xc6869a93ef55e1d8ec8fdcda89c9d93616cf0a72";
  // export const US_ELECTION_ADDRESS = "0xA09fF4F39FD8553051ABf0188100b7C5A6dc5452";
  //0x866ecA9F4C1504EbbEd4ef840fD32439Ad27415D
  export const ALBT_TOKEN_ADDRESS = "0xc6869a93ef55e1d8ec8fdcda89c9d93616cf0a72";
  export const US_ELECTION_ADDRESS = "0x866ecA9F4C1504EbbEd4ef840fD32439Ad27415D";
  