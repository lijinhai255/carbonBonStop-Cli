/*
 * @@description:
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
} from "@formily/antd";
import { createForm, onFieldValueChange } from "@formily/core";
import { createSchemaField } from "@formily/react";
import { Modal, Button } from "antd";
import { useMemo } from "react";

import { AuditDto } from "@/sdks_v2/new/supplychainV2ApiDocs";
import { TextArea } from "@/views/eca/component/TextArea";

import { schema } from "./utils/schemas";

export const ApproveModal = ({
  open,
  handleCancel,
  handleOk,
}: {
  /** 弹窗的显隐 */
  open: boolean;
  /** 关闭弹窗的方法 */
  handleCancel: () => void;
  /** 弹窗确定按钮的方法 */
  handleOk: (value: AuditDto) => void;
}) => {
  const SchemaField = createSchemaField({
    components: {
      Form,
      FormItem,
      FormGrid,
      FormLayout,
      Radio,
      Input,
      TextArea,
    },
  });
  const form = useMemo(() => {
    return createForm({
      effects() {
        onFieldValueChange("auditStatus", () => {
          form.reset("auditComment");
        });
      },
    });
  }, []);
  return (
    <Modal
      centered
      title="审核"
      open={open}
      maskClosable={false}
      onCancel={handleCancel}
      footer={[
        <Button
          onClick={() => {
            form.reset();
            handleCancel();
          }}
        >
          关闭
        </Button>,
        <Button
          onClick={async () => {
            form.submit(async (value: AuditDto) => {
              handleOk(value);
            });
          }}
          type="primary"
        >
          确定
        </Button>,
      ]}
    >
      <Form form={form} previewTextPlaceholder="-">
        <SchemaField schema={schema()} />
      </Form>
    </Modal>
  );
};
