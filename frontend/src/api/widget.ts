import request from "@/utils/request";

const likeMenu = ({ widgetId, itemId }: { itemId: number; widgetId: number }) =>
  request({
    method: "post",
    url: `/api/v1/widgets/${widgetId}/data/${itemId}/likes`
  }).then((res) => res.data.data);

export { likeMenu };
