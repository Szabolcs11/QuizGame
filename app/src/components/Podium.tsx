import React from "react";
import { AnimatePresence, motion } from "framer-motion";

function Podium() {
  return (
    // <div className="podiumcontainer">
    <div className="podiumcontent">
      <motion.div
        className="podium left"
        initial={{ height: 50 }}
        animate={{ height: 140 }}
        transition={{ duration: 1.5 }}
      >
        <div className="podiumtitle">
          <span style={{ fontSize: 32 }}>3</span>rd
        </div>
        <motion.div
          initial={{ opacity: 1, scale: 1, bottom: 0 }}
          animate={{ opacity: 1, scale: 1, bottom: 15 }}
          transition={{ duration: 2 }}
          className="podiumfooter"
        >
          1250
        </motion.div>
      </motion.div>
      <motion.div className="podium" initial={{ height: 50 }} animate={{ height: 220 }} transition={{ duration: 2 }}>
        <div className="podiumtitle">
          <span style={{ fontSize: 32 }}>1</span>st
        </div>
        <motion.div
          initial={{ opacity: 1, scale: 1, bottom: 0 }}
          animate={{ opacity: 1, scale: 1, bottom: 15 }}
          transition={{ duration: 2 }}
          className="podiumfooter"
        >
          1250
        </motion.div>
      </motion.div>
      <motion.div
        className="podium right"
        initial={{ height: 50 }}
        animate={{ height: 160 }}
        transition={{ duration: 1 }}
      >
        <div className="podiumtitle">
          <span style={{ fontSize: 32 }}>2</span>nd
        </div>
        <motion.div
          initial={{ opacity: 1, scale: 1, bottom: 0 }}
          animate={{ opacity: 1, scale: 1, bottom: 15 }}
          transition={{ duration: 2 }}
          className="podiumfooter"
        >
          1250
        </motion.div>
      </motion.div>
    </div>
    // </div>
  );
}

export default Podium;
