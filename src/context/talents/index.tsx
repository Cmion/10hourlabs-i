import { ReactNode, createContext, useState } from "react";
import createApiRequest from "../../_shared/api";
import { message } from "antd";
import { pick } from "lodash";

export enum Status {
  Loading = "loading",
  Error = "error",
  Idle = "idle",
}

export interface TalentsContextValues {
  talents: TalentNamespace.Talent[];
  savedTalents: TalentNamespace.Talent[];
  metadata: TalentNamespace.TalentMetadata;
  status: Status;
  getTalents: (options?: { params?: Record<string, any> }) => void;
  saveTalent: (talents: TalentNamespace.Talent) => void;
  undoSaveTalent: (uuid: string) => void;
}

interface TalentsContextProps {
  children: ReactNode;
}

export const TalentsContext = createContext<TalentsContextValues>({
  getTalents: () => null,
  saveTalent: (talents: TalentNamespace.Talent) => null,
  undoSaveTalent: (uuid: string) => null,
  talents: [],
  savedTalents: [],
  status: Status.Idle,
  metadata: {
    next: null,
    total: 0,
  },
});

export const TalentsProvider = (props: TalentsContextProps) => {
  const { children } = props;

  const [talents, setTalents] = useState<TalentNamespace.Talent[]>([]);
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [metadata, setMetadata] = useState<TalentNamespace.TalentMetadata>({
    total: 0,
    next: null,
  });

  const [selectedTalents, setSelectedTalents] = useState<
    TalentNamespace.Talent[]
  >([]);

  const getTalents = async (options: { params?: Record<string, any> } = {}) => {
    setStatus(Status.Loading);
    console.log("getTalents", options);
    try {
      const data = await createApiRequest({
        method: "GET",
        url: "/talents",
        ...options,
      });
      console.log(data);
      setTalents((data as any).items as unknown as TalentNamespace.Talent[]);
      setMetadata(
        pick(data, [
          "total",
          "next",
        ]) as unknown as TalentNamespace.TalentMetadata
      );
      setStatus(Status.Idle);
    } catch (e: any) {
      message.error({
        content: "Oops! Something went wrong",
        description: e.message,
        duration: 5,
      });
      setStatus(Status.Error);
    }
  };

  const saveTalent = (talent: TalentNamespace.Talent) => {
    setSelectedTalents((prevState) => {
      const newTalents = [...prevState];
      const index = newTalents.findIndex((t) => t.uuid === talent.uuid);
      if (index === -1) {
        newTalents.push(talent);
      } else {
        newTalents[index] = talent;
      }

      message.success("Talent saved");

      return newTalents;
    });
  };

  const undoSaveTalent = (uuid: string) => {
    setSelectedTalents((prevState) => {
      const newTalents = [...prevState];
      const index = newTalents.findIndex((t) => t.uuid === uuid);
      if (index !== -1) {
        newTalents.splice(index, 1);
      }

      message.success("Talent unsaved");
      return newTalents;
    });
  };
  const values = {
    getTalents,
    saveTalent,
    savedTalents: selectedTalents,
    talents,
    status,
    metadata,
    undoSaveTalent,
  };

  return (
    <TalentsContext.Provider value={values}>{children}</TalentsContext.Provider>
  );
};
