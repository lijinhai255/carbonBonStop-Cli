/*
 * @Description: 用户中心-碳账户明细
 */
import { getUserScoreList } from "@/api/default";
import { RecordType } from "@/api/default/types";
import { View, Image, Picker, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styles from "./index.module.less";

const tabs = [
  {
    key: "",
    title: "全部",
  },
  {
    key: "0",
    title: "收入",
  },
  {
    key: "1",
    title: "支出",
  },
];

export default function CADetail() {
  const [date, setdate] = useState<string>(dayjs(new Date()).format("YYYY-MM"));
  const [action, setAction] = useState<string>("");
  const [detailData, setDetailData] = useState<RecordType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [noMore, setNoMore] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, [date, page, action]);

  // 获取用户信息
  const init = async () => {
    const params = {
      date: date,
      pageNum: page,
      pageSize: 10,
      scoreType: action ? Number(action) : undefined,
    };
    let res = await getUserScoreList(params);
    const { data, code, msg } = res.data;
    if (code == 200) {
      setTotal(data.total);
      setDetailData((prevData) => [...prevData, ...data.records]);
    } else {
      Taro.showToast({ icon: "none", title: msg || "" });
    }
  };

  // 切换日期
  const onDateChange = (e) => {
    e.stopPropagation(); // 阻止冒泡
    setdate(e.detail.value);
    setDetailData([]);
    setPage(1);
    setNoMore(false);
  };

  // 切换查询类型
  const onTabs = (item) => {
    setAction(item.key);
    setDetailData([]);
    setPage(1);
    setNoMore(false);
  };

  // 上拉更新
  const onLower = () => {
    if (detailData.length >= total) {
      setNoMore(true);
    } else {
      const pageNum = page + 1;
      setPage(pageNum);
    }
  };

  return (
    <View className={styles.wrapper}>
      <View>
        <Picker mode="date" fields="month" value={date} onChange={onDateChange}>
          <View className={styles.picker}>
            {date}
            <Image
              className={styles.imgBottom}
              src={require("../../../assets/images/icon-bottom@2x.png")}
            />
          </View>
        </Picker>
      </View>
      {/* tabs 切换收入/支出类型 */}
      <View className={styles.tabs}>
        {tabs?.map((item) => (
          <View
            key={item.key}
            className={classNames(styles.item, {
              [styles.action]: action === item.key,
            })}
            onClick={() => action !== item.key && onTabs(item)}
          >
            {item.title}
          </View>
        ))}
      </View>
      {/* 下拉加载开始 */}
      <View className={styles.infoList}>
        <ScrollView
          className={styles.scrollView}
          scrollY
          onScrollToLower={onLower}
        >
          {detailData?.map((item) => (
            <View key={item.id} className={styles.item}>
              <View className={styles.title}>
                {item.scoreType_name + "："}
                {Number(item.scoreType) === 1 ? item.goodsName : item.sceneName}
              </View>
              <View className={styles.content}>
                <View className={styles.date}>{item.createTime}</View>
                <View className={styles.score}>
                  {item.changeScore ? `积分` + item.changeScore : ""}
                  {item.changeCers ? ` 减排量${item.changeCers}g` : ""}
                </View>
              </View>
            </View>
          ))}
          {detailData.length > 0 && noMore && (
            <View className={styles.noMore}>没有更多内容了</View>
          )}
          {(!detailData || detailData.length === 0) && (
            <View className={styles.noData}>
              <Image
                className={styles.imgNoData}
                src={require("../../../assets/images/Icon-CurrentlyNoData@2x.png")}
              />
              <View>还没有兑换过商品，快去积累兑换吧～</View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
