import {
  Table,
  Select,
  Button,
  Space,
  Input,
  InputNumber,
  Form,
  FormInstance,
} from "antd";
import { Status } from "../../context";
import { talentsTableColumn } from "../../_shared";
import { ReactNode } from "react";
import { isEmpty, isFunction } from "lodash";

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
  onFilter?: (values: Record<string, any>) => void;
  onFilterReset?: () => void;
  filterForm?: FormInstance;
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
    filterForm,
    onPaginate,
    onHideTalent,
    onRestoreTalent,
    onFilter,
    onFilterReset,
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
      {tabType === "all" && (
        <Form onFinish={onFilter} form={filterForm}>
          <Space size={20} style={{ paddingBottom: 20 }}>
            <Form.Item
              noStyle
              name={"job_title"}
              rules={[{ whitespace: false }]}
            >
              <Input placeholder="Filter by job title" />
            </Form.Item>
            <Form.Item
              noStyle
              name={"years_of_experience"}
              rules={[{ min: 0, type: "number" }]}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: 220 }}
                placeholder="Filter by years of experience"
              />
            </Form.Item>
            <Form.Item noStyle name={"city"} rules={[{ whitespace: false }]}>
              <Input placeholder="Filter by city" />
            </Form.Item>
            <Form.Item noStyle name={"country"} rules={[{ whitespace: false }]}>
              <Input placeholder="Filter by country" />
            </Form.Item>
            <Button type={"primary"} htmlType={"submit"}>
              Filter
            </Button>
            <Button htmlType={"button"} onClick={onFilterReset}>
              Reset
            </Button>
          </Space>
        </Form>
      )}
      <Table
        columns={columns}
        dataSource={talents}
        loading={status === Status.Loading}
        rowKey={(record: Record<string, any>) => record.uuid}
        pagination={false}
        scroll={{ x: 1300 }}
      />

      {onPaginate && isFunction(onPaginate) && (
        <Space
          size={20}
          style={{ paddingTop: 30, width: "100%", justifyContent: "flex-end" }}
          align={"center"}
        >
          <Button
            disabled={isEmpty(metadata?.prev)}
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
