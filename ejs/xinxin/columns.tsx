/*
 * @@description:
 */

import { Modal } from "antd";
import { compact } from "lodash-es";
import { NavigateFunction } from "react-router-dom";
import { TableContext, TableRenderProps } from "table-render/dist/src/types";

import { TableActions } from "@/components/Table/TableActions";
import { checkAuth } from "@/layout/utills";
import { EcaRouteMaps } from "@/router/utils/ecaEmums";
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from "@/router/utils/enums";
import {
  EmissionStandard,
  POST0540a2e0199fc79a1fda7d93875d7cf7,
} from "@/sdks/computation/computationV2ApiDocs";
import { returnDelModalStyle, returnNoIconModalStyle, Toast } from "@/utils";

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>["refresh"];
}): TableRenderProps<EmissionStandard>["columns"] => [
  {
    title: "所属组织",
    dataIndex: "orgName",
    // copyable: true,
  },
  {
    title: "基准年份 ",
    dataIndex: "startYear",
    render: (value, record) => {
      return Number(record?.settingType) === 1
        ? value.toString()
        : `${value}-${record.endYear}`;
    },
  },
  {
    title: "基准排放量（tCO₂e）",
    dataIndex: "standardEmission",
  },

  {
    title: "更新人",
    dataIndex: "updateByName",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    width: 200,
  },
  {
    title: "操作",
    width: 240,
    dataIndex: "id",
    render(id, record) {
      return (
        <TableActions
          menus={compact([
            checkAuth("/baseYearInfo/Edit", {
              label: "编辑",
              key: "编辑",
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.baseYearInfo,
                    [PAGE_TYPE_VAR, ":id"],
                    [PageTypeInfo.edit, id]
                  )
                );
              },
            }),

            checkAuth("/baseYearInfo/Del", {
              label: "删除",
              key: "删除",
              onClick: async () => {
                Modal.confirm({
                  title: "提示",
                  ...returnNoIconModalStyle,
                  ...returnDelModalStyle,
                  content: (
                    <span>
                      确认删除该组织的基准年：
                      <span className="modal_text">{record?.orgName}</span>
                    </span>
                  ),
                  onOk: () => {
                    return POST0540a2e0199fc79a1fda7d93875d7cf7({
                      req: { id },
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        Toast("success", "删除成功");
                        refresh?.();
                      }
                    });
                  },
                });
              },
            }),
            checkAuth("/baseYearInfo/Show", {
              label: "查看",
              key: "查看",
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.baseYearInfo,
                    [PAGE_TYPE_VAR, ":id"],
                    [PageTypeInfo.show, id]
                  )
                );
              },
            }),
          ])}
        />
      );
    },
  },
];
