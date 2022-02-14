import { capitalize, get } from "lodash";
import { Button, Descriptions, Popover, Space, Tag, Popconfirm } from "antd";
import { format } from "date-fns";

export const talentsTableColumn = (props: Record<string, any>) => {
  const defColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Record<string, any>) => {
        return (
          <span>
            {record.first_name} {record.last_name}
          </span>
        );
      },
    },
    {
      title: "Preferred Job Title",
      dataIndex: "preferred_job_title",
      key: "preferred_job_title",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string, record: Record<string, any>) => {
        return (
          <span>
            <a href={`mailto:${record.email}`}>{record.email}</a>
          </span>
        );
      },
    },
    {
      title: "Portfolio",
      dataIndex: "portfoliolinks",
      key: "portfoliolinks",
      render: (text: string, record: TalentNamespace.Talent) => {
        const portfoliolinks = get(record, ["edges", "portfoliolinks"], []);
        const content = (
          <div>
            {portfoliolinks.map((item: any, index: number) => (
              <Descriptions
                title={item.name}
                size={"small"}
                bordered
                key={"portfoliolinks" + index}
              >
                <Descriptions.Item label="Link">
                  <a href={item.url} rel={"noreferrer"} target={"_blank"}>
                    {item.url}
                  </a>
                </Descriptions.Item>
              </Descriptions>
            ))}
          </div>
        );
        return (
          <Popover content={content} title="Skills" trigger="click">
            <Button>See Portfolio</Button>
          </Popover>
        );
      },
    },
    {
      title: "Skills",
      dataIndex: "skills",
      key: "skills",
      render: (text: string, record: TalentNamespace.Talent) => {
        const skills = get(record, ["edges", "skills"], []);
        const content = (
          <div>
            {skills.map((item: any, index: number) => (
              <Descriptions
                title={item.name}
                size={"small"}
                bordered
                key={"skills" + index}
              >
                <Descriptions.Item label="Years of Experience">
                  <strong>{capitalize(item.years_of_experience)}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Preferred">
                  <Tag color={item.preferred ? "green" : "red"}>
                    {capitalize(item.preferred ? "Yes" : "No")}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Note">{item.note}</Descriptions.Item>
              </Descriptions>
            ))}
          </div>
        );
        return (
          <Popover content={content} title="Skills" trigger="click">
            <Button>See Skills</Button>
          </Popover>
        );
      },
    },
    {
      title: "Work Experiences",
      dataIndex: "work_experiences",
      key: "work_experiences",
      render: (text: string, record: TalentNamespace.Talent) => {
        const experiences = get(record, ["edges", "work_experiences"], []);

        const content = (
          <div>
            {experiences.map((item: any, index: number) => (
              <Descriptions
                title={item.company_name}
                size={"small"}
                bordered
                key={"work_experiences" + index}
              >
                <Descriptions.Item label="Job Title">
                  <strong>{capitalize(item.job_title)}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Location">
                  {capitalize(item.location)}
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  {item.description}
                </Descriptions.Item>
                <Descriptions.Item label="Start">
                  {format(new Date(item.start_date), "dd/mm/yyyy")}
                </Descriptions.Item>
                <Descriptions.Item label="End">
                  {format(new Date(item.end_date), "dd/mm/yyyy")}
                </Descriptions.Item>
                <Descriptions.Item label="Primary Technologies">
                  {get(item, ["primary_technologies"], []).map(
                    (tech: string, index: number) => {
                      return (
                        <Tag
                          key={"primary_technologies" + index}
                          color="volcano"
                        >
                          {tech}
                        </Tag>
                      );
                    }
                  )}
                </Descriptions.Item>
              </Descriptions>
            ))}
          </div>
        );
        return (
          <Popover content={content} title="Work Experiences" trigger="click">
            <Button>See Work Experiences</Button>
          </Popover>
        );
      },
    },
    {
      title: "Education",
      dataIndex: "education",
      key: "education",
      render: (text: string, record: TalentNamespace.Talent) => {
        const education = get(record, ["edges", "educations"], []);
        const content = (
          <div>
            {education.map((item: any, index: number) => (
              <Descriptions
                key={"education" + index}
                title={item.institution_name}
                size={"small"}
                bordered
              >
                <Descriptions.Item label="Degree">
                  <strong>{capitalize(item.degree)}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Field of study">
                  {capitalize(item.program)}
                </Descriptions.Item>
                <Descriptions.Item label="Overview">
                  {item.overview}
                </Descriptions.Item>
                <Descriptions.Item label="Start">
                  {format(new Date(item.start_date), "dd/mm/yyyy")}
                </Descriptions.Item>
                <Descriptions.Item label="End">
                  {format(new Date(item.end_date), "dd/mm/yyyy")}
                </Descriptions.Item>
              </Descriptions>
            ))}
          </div>
        );
        return (
          <Popover content={content} title="Educations" trigger="click">
            <Button>See Educations</Button>
          </Popover>
        );
      },
    },
  ];

  if (props.tabType === "all") {
    return Array.of(...defColumns, {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text: string, record: Record<string, any>) => {
        return (
          <Space size={20}>
            <Button
              disabled={props.isSaved(record.uuid)}
              onClick={() => props.onSaveTalent(record)}
            >
              Save
            </Button>
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={() => props.onHideTalent(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Hide</Button>
            </Popconfirm>
          </Space>
        );
      },
    });
  }

  if (props.tabType === "saved") {
    return Array.of(...defColumns, {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text: string, record: Record<string, any>) => {
        return (
          <Button onClick={() => props.undoSaveTalent(record.uuid)} danger>
            Remove
          </Button>
        );
      },
    });
  }

  if (props.tabType === "hidden") {
    return Array.of(...defColumns, {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text: string, record: Record<string, any>) => {
        return (
          <Button onClick={() => props.onRestoreTalent(record)}>Restore</Button>
        );
      },
    });
  }

  return defColumns;
};
