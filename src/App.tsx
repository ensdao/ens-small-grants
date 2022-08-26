import { Route, Routes } from 'react-router-dom';

import BasicLayout from './layouts/BasicLayout';
import { CreateProposal } from './screens/CreateProposal';
import { CreateSnapshot } from './screens/CreateSnapshot';
import Home from './screens/Home';
import Proposal from './screens/Proposal';
import { Round } from './screens/Round';
import Rounds from './screens/Rounds';

function App() {
  return (
    <BasicLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rounds" element={<Rounds />} />
        <Route path="/rounds/:id" element={<Round />} />
        <Route path="/rounds/:roundId/proposals/create" element={<CreateProposal />} />
        <Route path="/rounds/:roundId/proposals/:id" element={<Proposal />} />
        <Route path="/rounds/:roundId/snapshot" element={<CreateSnapshot />} />
      </Routes>
    </BasicLayout>
  );
}

export default App;
