import { Table } from "antd";
import { Status } from "../../context";
import { talentsTableColumn } from "../../_shared";

interface TalentsListProps {
  talents: TalentNamespace.Talent[];
  savedTalents?: TalentNamespace.Talent[];
  status: Status;
  tabType?: string;
  saveTalent?: (talent: TalentNamespace.Talent) => void;
  undoSaveTalent?: (uuid: string) => void;
}

export const TalentsList = (props: TalentsListProps) => {
  const { talents, status, saveTalent, savedTalents, tabType, undoSaveTalent } =
    props;

  const isSaved = (uuid: string) => {
    if (savedTalents) {
      return savedTalents.findIndex((t) => t.uuid === uuid) !== -1;
    }
    return false;
  };
  return (
    <div>
      <Table
        columns={talentsTableColumn({
          saveTalent,
          undoSaveTalent,
          isSaved,
          tabType: tabType ?? "all",
        })}
        dataSource={talents}
        loading={status === Status.Loading}
        rowKey={(record: Record<string, any>) => record.uuid}
      />
    </div>
  );
};
