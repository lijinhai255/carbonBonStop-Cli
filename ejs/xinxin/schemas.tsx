import { xRenderSeachSchema } from "@/components/x-render/TableRender/utils/xRender";
import { SearchProps } from "table-render/dist/src/types";
export const SearchSchema = (): SearchProps<any>["schema"] => {
  return {
    type: "object",
    properties: {
      orgId: xRenderSeachSchema({
        required: false,
        type: "string",
        placeholder: "所属组织",
        widget: "input",
      }),
    },
  };
};
