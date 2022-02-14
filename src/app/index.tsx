import "antd/dist/antd.dark.css";
import "./app.css";
import { useContext, useEffect } from "react";
import { TalentsContext } from "../context";
import { Tabs } from "antd";
import { TalentsList } from "../components/talents-list";

const { TabPane } = Tabs;

export const App = () => {
  const {
    getTalents,
    talents,
    status,
    onSaveTalent,
    savedTalents,
    undoSaveTalent,
    metadata,
    onPaginate,
    onHideTalent,
    onRestoreTalent,
    hiddenTalents,
  } = useContext(TalentsContext);

  const onGetTalents = async () => {
    await getTalents();
  };

  useEffect(() => {
    onGetTalents();
  }, []);

  return (
    <div className="App">
      <Tabs defaultActiveKey="all" centered>
        <TabPane tab="All" key="all">
          <TalentsList
            talents={talents}
            status={status}
            onSaveTalent={onSaveTalent}
            savedTalents={savedTalents}
            metadata={metadata}
            onPaginate={onPaginate}
            onHideTalent={onHideTalent}
            onRestoreTalent={onRestoreTalent}
          />
        </TabPane>
        <TabPane tab="Saved" key="saved">
          <TalentsList
            talents={savedTalents}
            tabType={"saved"}
            status={status}
            undoSaveTalent={undoSaveTalent}
          />
        </TabPane>
        <TabPane tab="Hidden" key="hidden">
          <TalentsList
            talents={hiddenTalents}
            tabType={"hidden"}
            status={status}
            onRestoreTalent={onRestoreTalent}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default App;
