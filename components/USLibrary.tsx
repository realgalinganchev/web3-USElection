import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useUSElectionContract from "../hooks/useUSElectionContract";
import Loader from "./Loader";

type USContract = {
  contractAddress: string;
};

export enum Leader {
  UNKNOWN,
  BIDEN,
  TRUMP
}

const USLibrary = ({ contractAddress }: USContract) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const usElectionContract = useUSElectionContract(contractAddress);
  const [currentLeader, setCurrentLeader] = useState<string>('Unknown');
  const [name, setName] = useState<string | undefined>();
  const [votesBiden, setVotesBiden] = useState<number | undefined>();
  const [votesTrump, setVotesTrump] = useState<number | undefined>();
  const [stateSeats, setStateSeats] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  const [txHash, setTxHash] = useState<string | undefined>("");
  const [seatsWonByBiden, setSeatsWonByBiden] = useState<number | undefined>();
  const [seatsWonByTrump, setSeatsWonByTrump] = useState<number | undefined>();
  const [stateOfElection, setStateOfElection] = useState<boolean | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');

  useEffect(() => {
    getCurrentLeader();
    getSeatsWonByBiden();
    getSeatsWonByTrump();
    getStateOfElection();
  })

  const getCurrentLeader = async () => {
    const currentLeader = await usElectionContract.currentLeader()
    setCurrentLeader(currentLeader == Leader.UNKNOWN ? 'Unknown' : currentLeader == Leader.BIDEN ? 'Biden' : 'Trump')
  }

  const getSeatsWonByBiden = async () => {
    setSeatsWonByBiden(await usElectionContract.seats(1))
  }

  const getSeatsWonByTrump = async () => {
    setSeatsWonByTrump(await usElectionContract.seats(2))
  }

  const getStateOfElection = async () => {
    setStateOfElection(await usElectionContract.electionEnded())
  }

  const stateInput = (input) => {
    setName(input.target.value)
  }

  const bideVotesInput = (input) => {
    setVotesBiden(input.target.value)
  }

  const trumpVotesInput = (input) => {
    setVotesTrump(input.target.value)
  }

  const seatsInput = (input) => {
    setStateSeats(input.target.value)
  }

  const submitStateResults = async () => {
    try {
      const result: any = [name, votesBiden, votesTrump, stateSeats];
      const tx = await usElectionContract.submitStateResult(result);
      setIsLoading(true);
      setTxHash(tx.hash);
      await tx.wait();
      resetForm();
      setIsLoading(false);
    } catch (err) {
      setErrorMessage(err.error.message.slice(20));
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }


  }

  const endElection = async () => {
    try {
      const tx = await usElectionContract.endElection();
      await tx.wait();
      setStateOfElection(true)
    }
    catch (err) {
      setErrorMessage(err.error.message.slice(20));
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
  }

  const resetForm = async () => {
    setName('');
    setVotesBiden(0);
    setVotesTrump(0);
    setStateSeats(0);
  }

  return (
    <div className="results-form">
      <p>
        Current Leader is: {currentLeader}
      </p>
      <div>
        <p>
          Seats currently won by Biden are {seatsWonByBiden}
        </p>
        <p>
          Seats currently won by Trump are {seatsWonByTrump}
        </p>
        {stateOfElection ?
          <p>
            The election has ended.
          </p>
          :
          <p>
            The election has not ended yet.
          </p>
        }
      </div>
      <form>
        <label>
          State:
          <input onChange={stateInput} value={name} type="text" name="state" />
        </label>
        <label>
          BIDEN Votes:
          <input onChange={bideVotesInput} value={votesBiden} type="number" name="biden_votes" />
        </label>
        <label>
          TRUMP Votes:
          <input onChange={trumpVotesInput} value={votesTrump} type="number" name="trump_votes" />
        </label>
        <label>
          Seats:
          <input onChange={seatsInput} value={stateSeats} type="number" name="seats" />
        </label>
        {/* <input type="submit" value="Submit" /> */}
      </form>
      <div className="button-wrapper">
        <button onClick={submitStateResults}>Submit Results</button>
      </div>
      {
        errorMessage && <div className="error-message">
          {errorMessage}
        </div>
      }

      <div className="button-wrapper">
        <button onClick={endElection}>End election</button>
      </div>
      {isLoading &&
        <Loader txHash={txHash} />
      }
      <style jsx>{`
        .results-form {
          display: flex;
          flex-direction: column;
        }

        .button-wrapper {
          margin: 20px;
        }
        
        .error-message{
          border: 1px solid;
          margin: 10px auto;
          padding: 15px 10px;
          background-repeat: no-repeat;
          background-position: 10px center;
          max-width: 460px;
          color: #D8000C;
	        background-color: #FFBABA;
        }
      `}</style>
    </div>
  );
};

export default USLibrary;
