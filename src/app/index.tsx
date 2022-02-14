import "antd/dist/antd.dark.css";
import "./app.css";
import { useContext, useEffect } from "react";
import { TalentsContext } from "../context";
import { Tabs } from "antd";
import { TalentsList } from "../components/talents-list";

const { TabPane } = Tabs;

export const App = () => {
  const { getTalents, talents, status, saveTalent, savedTalents, undoSaveTalent } =
    useContext(TalentsContext);

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
            saveTalent={saveTalent}
            savedTalents={savedTalents}
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
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </div>
  );
};
export default App;
