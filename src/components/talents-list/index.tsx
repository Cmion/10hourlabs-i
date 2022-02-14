import { Table, Select, Button, Space } from "antd";
import { Status } from "../../context";
import { talentsTableColumn } from "../../_shared";
import { ReactNode } from "react";
import { isFunction } from "lodash";

interface TalentsListProps {
  talents: TalentNamespace.Talent[];
  savedTalents?: TalentNamespace.Talent[];
  status: Status;
  tabType?: string;
  onSaveTalent?: (talent: TalentNamespace.Talent) => void;
  onHideTalent?: (talent: TalentNamespace.Talent) => void;
  onRestoreTalent?: (talent: TalentNamespace.Talent) => void;
  undoSaveTalent?: (uuid: string) => void;
  metadata?: TalentNamespace.TalentMetadata;
  onPaginate?: (options: { type: string; limit?: number }) => void;
}

export const TalentsList = (props: TalentsListProps) => {
  const {
    talents,
    status,
    onSaveTalent,
    savedTalents,
    tabType = "all",
    undoSaveTalent,
    metadata,
    onPaginate,
    onHideTalent,
    onRestoreTalent,
  } = props;

  const isSaved = (uuid: string) => {
    if (savedTalents) {
      return savedTalents.findIndex((t) => t.uuid === uuid) !== -1;
    }
    return false;
  };

  const columnProps = {
    onSaveTalent,
    undoSaveTalent,
    isSaved,
    tabType,
    onRestoreTalent,
    onHideTalent,
  };
  const columns = talentsTableColumn(columnProps);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={talents}
        loading={status === Status.Loading}
        rowKey={(record: Record<string, any>) => record.uuid}
        pagination={false}
      />

      {onPaginate && isFunction(onPaginate) && (
        <Space
          size={20}
          style={{ paddingTop: 30, width: "100%", justifyContent: "flex-end" }}
          align={"center"}
        >
          <Button
            disabled={!metadata?.prev}
            onClick={() =>
              onPaginate({
                type: "prev",
              })
            }
          >
            Previous
          </Button>
          <Button
            disabled={!metadata?.next}
            onClick={() =>
              onPaginate({
                type: "next",
              })
            }
          >
            Next
          </Button>
          <Select
            defaultValue={10}
            style={{ width: 120 }}
            options={Array.from({ length: 10 }, (v, i) => ({
              label: `${i + 1} / page`,
              value: i + 1,
            }))}
            onChange={(value: number) =>
              onPaginate({
                type: "limit",
                limit: value,
              })
            }
          />
        </Space>
      )}
    </div>
  );
};
