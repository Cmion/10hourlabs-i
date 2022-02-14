import "antd/dist/antd.dark.css";
import "./app.css";
import { useContext, useEffect } from "react";
import { TalentsContext } from "../context";
import { Form, Tabs, Typography } from "antd";
import { TalentsList } from "../components/talents-list";
import { isEmpty } from "lodash";

const { Title, Text } = Typography;
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

  const [filterForm] = Form.useForm();

  const onGetTalents = async () => {
    await getTalents();
  };

  const onFilter = async (filter: Record<string, any>) => {
    const clonedFilter = { ...filter };
    for (let value in filter) {
      if (isEmpty(clonedFilter[value])) {
        delete clonedFilter[value];
      }
    }
    getTalents({
      params: clonedFilter,
    });
  };
  const onFilterReset = () => {
    filterForm.resetFields();
    onGetTalents();
  };

  useEffect(() => {
    onGetTalents();
  }, []);

  return (
    <div className="App">
      <Title>10HourLabs: Take Home</Title>
      <Text type="secondary">Please note:</Text>
      <br />
      <ul>
        <li>
          <Text type="secondary">
            The API endpoint does not return an image or profile image{" "}
            <Text code>key:value</Text>
          </Text>
        </li>

        <li>
          <Text type="secondary">
            Ignored profiles are stored in the hidden tab
          </Text>
        </li>

        <li>
          <Text type="secondary">
            Saved profiles are stored in the saved tab
          </Text>
        </li>

      </ul>
      <Tabs defaultActiveKey="all" centered>
        <TabPane tab="All" key="all">
          <TalentsList
            talents={talents}
            status={status}
            onSaveTalent={onSaveTalent}
            savedTalents={savedTalents}
            metadata={metadata}
            filterForm={filterForm}
            onPaginate={onPaginate}
            onHideTalent={onHideTalent}
            onRestoreTalent={onRestoreTalent}
            onFilter={onFilter}
            onFilterReset={onFilterReset}
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
