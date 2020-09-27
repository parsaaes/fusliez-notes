import { INITIAL_DATA, useData } from "context";
import { JssProvider, ThemeProvider } from "react-jss";

import ControlsContent from "./ControlsContent";
import FeedbackForm from "./FeedbackForm";
import MainContent from "./MainContent";
import MapsContent from "./MapsContent";
import Modal from "./common/Modal";
import React from "react";
import Recovery from "./Recovery";
import jssSetUp from "utils/jssSetUp";
import Scores from "./Scores";
import ScoresPanel from "./ScoresPanel";
import TabNavigator from "./TabNavigator";

export const MobileContext = React.createContext();

export default function App(): JSX.Element {
  const { version, theme } = useData()!; // eslint-disable-line
  const [showNotes, setShowNotes] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  React.useEffect(() => {
    if (version !== INITIAL_DATA.version) {
      setShowNotes(true);
    }
  }, []);

  const patchNotes = [
    {
      title: "Added",
      items: [
        "Separate Scores for impostors and innocents",
        "Color change menu for players (click player icon to open)",
        "Reset Scores",
        "Reset Round (players positions)",
        "Reset all button, resets players positions and scores.",
        "Reset Notes",
        "Settings Modal",
        "Recovery Notes Modal",
        "Change log Modal",
        "Feedback Modal",
        "Draggable Players on Map",
        "Button to reset draggable players on Map",
      ],
    },
    {
      title: "Fixed",
      items: ["Player background color contrast", "Danger theme button"],
    },
    { title: "Changed", items: ["Use names to the settings modal."] },
    { title: "Removed", items: ["Light theme"] },
    {
      title: "Developer Notes",
      items: [
        "We are working in allowing custom theme colors.",
        "We added a feedback link at the bottom at the page, we love to hear from all of you.",
      ],
    },
  ];

  const [width, setWidth] = React.useState(window.innerWidth);
  // const [useDesktop, setUseDesktop] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState("Record");

  const breakpoint = 846;

  const isMobile = width <= breakpoint;

  React.useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  return (
    <React.Fragment>
      <JssProvider registry={jssSetUp(theme)}>
        <ThemeProvider theme={theme}>
          <MobileContext.Provider value={isMobile}>
            <React.Suspense fallback="loading">
              {isMobile ? (
                <>
                  {currentTab === "Players" ? (
                    <MainContent isMobile={isMobile} />
                  ) : currentTab === "Maps" ? (
                    <MapsContent />
                  ) : currentTab === "Record" ? (
                    <>
                      <Scores />
                      <ScoresPanel />
                    </>
                  ) : null}
                  <>
                    <TabNavigator
                      currentTab={currentTab}
                      setCurrentTab={setCurrentTab}
                    />
                    <footer>
                      <small>
                        fusliez notes{" "}
                        <a
                          href="https://github.com/Kedyn/fusliez-notes/releases/tag/v0.7.0"
                          onClick={(
                            event: React.MouseEvent<
                              HTMLAnchorElement,
                              MouseEvent
                            >
                          ) => {
                            event.preventDefault();
                            setShowNotes(!showNotes);
                          }}
                        >
                          {version}
                        </a>{" "}
                        [9/24/2020] made with &#10084; by the{" "}
                        <a href="https://github.com/Kedyn/fusliez-notes#authors-and-acknowledgment">
                          fuslie fam
                        </a>
                        . <a onClick={() => setShowForm(true)}>Feedback</a>
                        <Modal
                          title="Feedback Form"
                          show={showForm}
                          onClose={() => setShowForm(false)}
                        >
                          <FeedbackForm />
                        </Modal>
                      </small>
                      {/* CHANGE LOG */}
                      <Modal
                        title="Change Log v0.8.0"
                        show={showNotes}
                        onClose={() => setShowNotes(false)}
                      >
                        {patchNotes.map(({ title, items }) => (
                          <div key={title}>
                            <h3>{title}</h3>
                            <ul>
                              {items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </Modal>
                    </footer>
                  </>
                </>
              ) : (
                <>
                  <main>
                    <MainContent isMobile={false} />
                    <ControlsContent />
                    <MapsContent isMobile={false} />
                  </main>
                  <footer>
                    <small>
                      fusliez notes{" "}
                      <a
                        href="https://github.com/Kedyn/fusliez-notes/releases/tag/v0.7.0"
                        onClick={(
                          event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                        ) => {
                          event.preventDefault();
                          setShowNotes(!showNotes);
                        }}
                      >
                        {version}
                      </a>{" "}
                      [9/24/2020] made with &#10084; by the{" "}
                      <a href="https://github.com/Kedyn/fusliez-notes#authors-and-acknowledgment">
                        fuslie fam
                      </a>
                      .{" "}
                      <a
                        href="#"
                        onClick={(
                          event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                        ) => {
                          event.preventDefault();
                          setShowForm(true);
                        }}
                      >
                        Feedback
                      </a>
                      <Modal
                        title="Feedback Form"
                        show={showForm}
                        onClose={() => setShowForm(false)}
                      >
                        <FeedbackForm />
                      </Modal>
                    </small>
                  </footer>
                  <Recovery />
                  {/* CHANGE LOG */}
                  <Modal
                    title={`Change Log v${version}`}
                    show={showNotes}
                    onClose={() => setShowNotes(false)}
                  >
                    {patchNotes.map(({ title, items }) => (
                      <div key={title}>
                        <h4>{title}</h4>
                        <ul>
                          {items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </Modal>
                  <Modal
                    title="Feedback Form"
                    show={showForm}
                    onClose={() => setShowForm(false)}
                  >
                    <FeedbackForm />
                  </Modal>
                </>
              )}
            </React.Suspense>
          </MobileContext.Provider>
        </ThemeProvider>
      </JssProvider>
    </React.Fragment>
  );
}
