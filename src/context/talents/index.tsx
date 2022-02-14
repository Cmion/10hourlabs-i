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
  hiddenTalents: TalentNamespace.Talent[];
  metadata: TalentNamespace.TalentMetadata;
  status: Status;
  getTalents: (options?: { params?: Record<string, any> }) => void;
  onSaveTalent: (talents: TalentNamespace.Talent) => void;
  undoSaveTalent: (uuid: string) => void;
  onPaginate: (params: { type: string; limit?: number }) => void;
  onHideTalent: (talents: TalentNamespace.Talent) => void;
  onRestoreTalent: (talents: TalentNamespace.Talent) => void;
}

interface TalentsContextProps {
  children: ReactNode;
}

export const TalentsContext = createContext<TalentsContextValues>({
  getTalents: () => null,
  onSaveTalent: (talents: TalentNamespace.Talent) => null,
  onHideTalent: (talents: TalentNamespace.Talent) => null,
  onRestoreTalent: (talents: TalentNamespace.Talent) => null,
  undoSaveTalent: (uuid: string) => null,
  onPaginate: (options: { type: string; limit?: number }) => null,
  talents: [],
  savedTalents: [],
  hiddenTalents: [],
  status: Status.Idle,
  metadata: {
    next: null,
    prev: null,
    limit: 10,
  },
});

export const TalentsProvider = (props: TalentsContextProps) => {
  const { children } = props;

  const [talents, setTalents] = useState<TalentNamespace.Talent[]>([]);
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [metadata, setMetadata] = useState<TalentNamespace.TalentMetadata>({
    limit: 10,
    next: null,
    prev: null,
  });

  const [selectedTalents, setSelectedTalents] = useState<
    TalentNamespace.Talent[]
  >([]);

  const [hiddenTalents, setHiddenTalents] = useState<TalentNamespace.Talent[]>(
    []
  );

  const getTalents = async (options: { params?: Record<string, any> } = {}) => {
    setStatus(Status.Loading);
    try {
      const data = await createApiRequest({
        method: "GET",
        url: "/talents",
        ...options,
      });

      setTalents((data as any).items as unknown as TalentNamespace.Talent[]);
      setMetadata((prevState) => {
        const partialState = { prev: prevState.next };

        return {
          ...prevState,
          ...partialState,
          ...(pick(data, [
            "total",
            "next",
          ]) as unknown as TalentNamespace.TalentMetadata),
        };
      });
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

  const onSaveTalent = (talent: TalentNamespace.Talent) => {
    setSelectedTalents((prevState) => {
      const newTalents = [...prevState];
      const index = newTalents.findIndex((t) => t.uuid === talent.uuid);
      if (index === -1) {
        newTalents.push(talent);
      } else {
        newTalents[index] = talent;
      }

      message.info("Profile saved");

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

      return newTalents;
    });
  };

  const onPaginate = (options: { type: string; limit?: number }) => {
    if (options.type === "next") {
      getTalents({
        params: {
          cursor: metadata.next,
          limit: metadata.limit,
        },
      });
    }
    if (options.type === "prev") {
      getTalents({
        params: {
          cursor: metadata.prev,
          limit: metadata.limit,
        },
      });
    }
    if (options.type === "limit") {
      getTalents({
        params: {
          limit: options?.limit ?? metadata.limit ?? 10,
        },
      });

      setMetadata((prev) => ({
        ...prev,
        limit: options?.limit ?? prev.limit,
        prev: null,
        next: null,
      }));
    }
  };

  const onHideTalent = (talent: TalentNamespace.Talent) => {
    setHiddenTalents((prevState) => {
      const newHiddenTalents = [...prevState];
      const index = newHiddenTalents.findIndex((t) => t.uuid === talent.uuid);
      if (index === -1) {
        newHiddenTalents.push(talent);
      } else {
        newHiddenTalents.splice(index, 1);
      }

      setTalents((prevState) => {
        const newTalents = [...prevState];
        const index = newTalents.findIndex((t) => t.uuid === talent.uuid);
        if (index !== -1) {
          newTalents.splice(index, 1);
        }

        return newTalents;
      });

      return newHiddenTalents;
    });
  };

  const onRestoreTalent = (talent: TalentNamespace.Talent) => {
    setHiddenTalents((prevState) => {
      const newHiddenTalents = [...prevState];
      const index = newHiddenTalents.findIndex((t) => t.uuid === talent.uuid);
      if (index !== -1) {
        newHiddenTalents.splice(index, 1);
      }
      setTalents((prev) => [...prev, talent]);

      return newHiddenTalents;
    });
  };

  const values = {
    savedTalents: selectedTalents,
    hiddenTalents,
    talents,
    status,
    metadata,
    getTalents,
    onSaveTalent,
    undoSaveTalent,
    onPaginate,
    onRestoreTalent,
    onHideTalent,
  };

  return (
    <TalentsContext.Provider value={values}>{children}</TalentsContext.Provider>
  );
};
