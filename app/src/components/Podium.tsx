import { motion } from "framer-motion";
import { ScoreboardPlayerType } from "../types";

interface PodiumProps {
  data: ScoreboardPlayerType[];
}

function Podium({ data }: PodiumProps) {
  return (
    <div className="podiumcontainer">
      <div className="podiumcontent">
        {data[2] ? (
          <motion.div
            className="podium left bronze"
            initial={{ height: 50 }}
            animate={{ height: 140 }}
            transition={{ duration: 1.5 }}
          >
            <div className="podiumtitle">
              <span style={{ fontSize: 32 }}>3</span>rd
            </div>
            <div className="podiumsubtitle">{data[2]?.Score}</div>
            <motion.div
              initial={{ opacity: 1, scale: 1, bottom: 0 }}
              animate={{ opacity: 1, scale: 1, bottom: 15 }}
              transition={{ duration: 2 }}
              className="podiumfooter"
            >
              {data[2].Name}
            </motion.div>
          </motion.div>
        ) : (
          <></>
        )}
        <motion.div
          className="podium gold"
          initial={{ height: 50 }}
          animate={{ height: 220 }}
          transition={{ duration: 2 }}
        >
          <div className="podiumtitle">
            <span style={{ fontSize: 32 }}>1</span>st
          </div>
          <div className="podiumsubtitle">{data[0].Score}</div>
          <motion.div
            initial={{ opacity: 1, scale: 1, bottom: 0 }}
            animate={{ opacity: 1, scale: 1, bottom: 15 }}
            transition={{ duration: 2 }}
            className="podiumfooter"
          >
            {data[0].Name}
          </motion.div>
        </motion.div>
        {data[1] ? (
          <motion.div
            className="podium right silver"
            initial={{ height: 50 }}
            animate={{ height: 160 }}
            transition={{ duration: 1 }}
          >
            <div className="podiumtitle">
              <span style={{ fontSize: 32 }}>2</span>nd
            </div>
            <div className="podiumsubtitle">{data[1].Score}</div>
            <motion.div
              initial={{ opacity: 1, scale: 1, bottom: 0 }}
              animate={{ opacity: 1, scale: 1, bottom: 15 }}
              transition={{ duration: 2 }}
              className="podiumfooter"
            >
              {data[1].Name}
            </motion.div>
          </motion.div>
        ) : (
          <></>
        )}
      </div>
      <div className="podiumscores">
        {data.splice(3).map((player, index) => (
          <div key={index} className="podiumscore">
            <div>{`#${index + 4}`}</div>
            <div>{player.Name}</div>
            <div>{player.Score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Podium;
