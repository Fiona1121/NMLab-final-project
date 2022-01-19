import React from "react";
import PropTypes from "prop-types";

const YoutubeLiveEmbed = ({ embedId }) => (
    <div className="video-responsive">
        <iframe
            width="750"
            height="400"
            src={`https://www.youtube.com/embed/${embedId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
        />
    </div>
);

YoutubeLiveEmbed.propTypes = {
    embedId: PropTypes.string.isRequired,
};

export default YoutubeLiveEmbed;
