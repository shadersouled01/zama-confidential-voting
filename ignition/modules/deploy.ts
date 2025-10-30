import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VotingMockModule", (m: any) => {
  const votingMock = m.contract("VotingMock");

  return { votingMock };
});

