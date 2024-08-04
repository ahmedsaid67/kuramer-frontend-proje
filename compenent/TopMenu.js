import React, { useCallback } from "react";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";

import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import Tooltip from "@mui/material/Tooltip";


import TwitterIcon from "@mui/icons-material/Twitter";
import YoutubeIcon from "@mui/icons-material/YouTube";

function TopMenu(props) {
  const editor = props.editor;

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // invalid url
    if (!url.match(/^(http|https):\/\/[^ "]+$/)) {
        console.log('URL geçersiz! "http://" "https://" ile başladığından emin olun')
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [dispatch, editor]);

  const addYoutubeVideo = () => {
    const url = prompt("YouTube Video URL");
    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      return;
    }

    editor.commands.setYoutubeVideo({
      src: url,
      width: "100%",
      height: 320,
    });
  };

  const setTwitterLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {

      console.log('URL alanı boş bırakılamaz.')
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // invalid url
    if (!url.match(/^(http|https):\/\/[^ "]+$/)) {

      console.log('URL geçersiz! "http://" "https://" ile başladığından emin olun')
      return;
    }

    // update link
    editor.chain().focus().setTwitterEmbed({ href: url }).run();
  }, [dispatch, editor]);

  return (
    editor && (
      <div>
        <Tooltip
          title={<span className="text-xs">İtalik</span>}
          placement="top"
          sx={{ fontSize: "12px" }}
          arrow
        >
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="bg-black p-3 border-x border-l-medium border-r-zinc-700"
            type="button"
          >
            <FormatItalicIcon
              sx={{
                fontSize: "16px",
                color: `${editor.isActive("italic") ? "#fe0024" : "#fff"}`,
              }}
            />
          </button>
        </Tooltip>

        <Tooltip
          title={<span className="text-xs">Altını Çiz</span>}
          placement="top"
          sx={{ fontSize: "12px" }}
          arrow
        >
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="bg-black text-white p-3 border-x border-l-medium border-r-zinc-700"
            type="button"
          >
            <FormatUnderlinedIcon
              sx={{
                fontSize: "16px",
                color: `${editor.isActive("underline") ? "#fe0024" : "#fff"}`,
              }}
            />
          </button>
        </Tooltip>

        <Tooltip
          title={<span className="text-xs">Üstünü Çiz</span>}
          placement="top"
          sx={{ fontSize: "12px" }}
          arrow
        >
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="bg-black text-white p-3 border-x border-l-medium border-r-zinc-700"
            type="button"
          >
            <FormatStrikethroughIcon
              sx={{
                fontSize: "16px",
                color: `${editor.isActive("strike") ? "#fe0024" : "#fff"}`,
              }}
            />
          </button>
        </Tooltip>

        <Tooltip
          title={<span className="text-xs">Madde İmli Liste</span>}
          placement="top"
          sx={{ fontSize: "12px" }}
          arrow
        >
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="bg-black text-white p-3 border-x border-l-medium border-r-zinc-700"
            type="button"
          >
            <FormatListBulletedIcon
              sx={{
                fontSize: "16px",
                color: `${editor.isActive("bulletList") ? "#fe0024" : "#fff"}`,
              }}
            />
          </button>
        </Tooltip>

        <Tooltip
          title={<span className="text-xs">Sıralı Liste</span>}
          placement="top"
          sx={{ fontSize: "12px" }}
          arrow
        >
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="bg-black text-white p-3 border-x border-l-medium border-r-zinc-700"
            type="button"
          >
            <FormatListNumberedIcon
              sx={{
                fontSize: "16px",
                color: `${editor.isActive("orderedList") ? "#fe0024" : "#fff"}`,
              }}
            />
          </button>
        </Tooltip>

        <Tooltip
          title={<span className="text-xs">Yatay Çizgi</span>}
          placement="top"
          sx={{ fontSize: "12px" }}
          arrow
        >
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="bg-black text-white p-3 border-x border-l-medium border-r-zinc-700"
            type="button"
          >
            <HorizontalRuleIcon sx={{ fontSize: "16px" }} />
          </button>
        </Tooltip>

        <Tooltip
          title={<span className="text-xs">Satır Sonu (Shift + Enter)</span>}
          placement="top"
          sx={{ fontSize: "12px" }}
          arrow
        >
          <button
            onClick={() => editor.chain().focus().setHardBreak().run()}
            className="bg-black text-white p-3 border-x border-l-medium border-r-zinc-700"
            type="button"
          >
            <KeyboardReturnIcon sx={{ fontSize: "16px" }} />
          </button>
        </Tooltip>

        <Tooltip
          title={<span className="text-xs">Bağlantı</span>}
          placement="top"
          sx={{ fontSize: "12px" }}
          arrow
        >
          <button
            onClick={setLink}
            className="bg-black text-white p-3 border-x border-l-medium border-r-zinc-700"
            type="button"
          >
            <LinkIcon sx={{ fontSize: "16px" }} />
          </button>
        </Tooltip>

        <Tooltip
          title={<span className="text-xs">Twitter</span>}
          placement="top"
          sx={{ fontSize: "12px" }}
          arrow
        >
          <button
            onClick={setTwitterLink}
            className="bg-black text-white p-3 border-x border-l-medium border-r-zinc-700"
            type="button"
          >
            <TwitterIcon sx={{ fontSize: "16px" }} />
          </button>
        </Tooltip>

        <Tooltip
          title={<span className="text-xs">Youtube</span>}
          placement="top"
          sx={{ fontSize: "12px" }}
          arrow
        >
          <button
            onClick={addYoutubeVideo}
            className="bg-black text-white p-3 border-x border-l-medium border-r-zinc-700"
            type="button"
          >
            <YoutubeIcon sx={{ fontSize: "16px" }} />
          </button>
        </Tooltip>
      </div>
    )
  );
}

export default TopMenu;
