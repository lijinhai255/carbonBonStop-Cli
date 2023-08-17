/**
 * @description : 列表
 */
import { useNavigate } from "react-router-dom";
import { withTable } from "table-render";

import { Page } from "@/components/Page";
import { TableRender } from "@/components/x-render/TableRender";
import type { CustomSearchProps } from "@/components/x-render/TableRender/types";
import { GETa170516aeb39260066f9aa698bc54312 } from "@/sdks_v2/new/enterprisesystemV2ApiDocs";

import { columns } from "./columns";
import { searchSchema } from "./schemas";

const EmissionApproval = () => {
  const navigate = useNavigate();
  const searchApi: CustomSearchProps<any, any> = (args) => {
    return GETa170516aeb39260066f9aa698bc54312(args).then(({ data }) => {
      return data?.data;
    });
  };

  return (
    <Page title="">
      <TableRender<any, any>
        searchProps={{
          schema: searchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ navigate }),
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};
export default withTable(EmissionApproval);
