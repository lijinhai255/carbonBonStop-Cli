#!/bin/bash

# 设置百度翻译API的相关信息
APP_ID="20230726001758571"
API_KEY="5vQdPlRR3m3UJikcj5Ju"
SECRET_KEY="5vQdPlRR3m3UJikcj5Ju"

# 中文图片文件夹 可以随便修改 根据自己情况来定
input_folder="./input/"
# 要输出的文件夹 可以随便修改 根据自己情况来定
output_folder="./output/"

# 创建输出文件夹
mkdir -p "$output_folder"

# 遍历输入文件夹中的图片文件
for image_file in "$input_folder"/*; do
  # 检查文件是否为图片
  if [[ ! -f "$image_file" || ! "$image_file" =~ \.(jpg|jpeg|png)$ ]]; then
      continue
  fi
  # 提取文件名（不包含扩展名）
  filename=$(basename "$image_file")
  extension="${filename%.*}"

  # 拼接字符串
  sign_string="$APP_ID$filename"1435660288"$API_KEY";
  # 计算MD5
  sign=$(echo -n "$sign_string" | md5 | awk '{print $1}');
  # 使用百度翻译进行翻译
  translation=$(curl -s -k "http://api.fanyi.baidu.com/api/trans/vip/translate?q=$filename&from=zh&to=en&appid=$APP_ID&salt=1435660288&sign=$sign");
  # 获取翻译后的英文命名
  english_result=$(echo "$translation" | jq -r '.trans_result[0].dst'| tr '[:upper:]' '[:lower:]' | tr -d ' ');

  echo $filename $english_result  

  # 构造输出文件路径
  output_path="${output_folder}/${english_result}"

  # 删除原始文件（如果存在）
  rm "$output_path"

  # 复制图片到输出文件夹中
  cp "$image_file" "$output_path"

done

echo "翻译完成！"