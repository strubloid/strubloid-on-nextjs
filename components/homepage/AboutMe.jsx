import React from "react";

// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components

function AboutMe() {
  return (
    <>
      <div className="section features-7 section-image homepage-about-me">
        <Container fluid>
          <Row>
            <Col className="px-0" md="6">
              <Col sm="12">
                <div className="info info-horizontal">
                  <div className="icon">
                    <i className="now-ui-icons users_single-02"></i>
                  </div>
                  <div className="description">
                    <h5 className="info-title">A little bit about me</h5>
                    <p className="description">
                      A Brazilian Software Engineer, well-rounded (+10 Yrs) in IT. You should expect a person with
                      agile behaviour, design patterns in the mindset that loves Linux that will build user-centred
                      design with proper documentation.
                    </p>
                  </div>
                </div>
                <div className="info info-horizontal">
                  <div className="icon">
                    <i className="now-ui-icons users_single-02"></i>
                  </div>
                  <div className="description">
                    <h5 className="info-title">PHP</h5>
                    <p className="description">
                      PHP its a serious relationship, that started in 2007 and continue in a few applications. In may 8 2010
                      I said to Rasmus Lerdoff on IV ENSOL that I will be using this tecnology for a while...I didn't think
                      that could it be for more than 10 years, starting with pure PHP, going to Yii, Zend I, Zend II,
                      Yii 2, Magento 1 and later on Magento 2
                    </p>
                  </div>
                </div>
                <div className="info info-horizontal">
                  <div className="icon">
                    <i className="now-ui-icons text_bold"></i>
                  </div>
                  <div className="description">
                    <h5 className="info-title">Bash scripting</h5>
                    <p className="description">
                      Bash scripting its pure Linux love, I got this from the GNU/Linux community with old friends:
                      Victor, Anahuac and Rodrigo.<br />
                      I've learned since 2005 that a good script is a written down one, and later on some refactorings. <br />
                      It is something that I use/do every day, so if you need something related to a terminal line
                      I am your guy! <br />For more information check it out <a href="https://github.com/strubloid/.bash_aliases" target="_blank" >Here</a>
                    </p>
                  </div>
                </div>
                <div className="info info-horizontal">
                  <div className="icon">
                    <i className="now-ui-icons education_paper"></i>
                  </div>
                  <div className="description">
                    <h5 className="info-title">React</h5>
                    <p className="description">
                      This was my digi-evolution from Node.Js, I could change the way that I was scripting with Javascript.
                      I follow the SOLID principles and always try to use as much as I can OO building good reusable components.
                    </p>
                  </div>
                </div>
              </Col>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default AboutMe;
