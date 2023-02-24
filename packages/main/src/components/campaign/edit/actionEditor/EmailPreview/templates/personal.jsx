/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-has-content */

import { useState, useEffect } from "react";
import Editor from "rich-markdown-editor"
import QuillEditor from "../../ControlsManager/Controls/QuillEditor/QuillEditor";

export default function PersonalTemplate({
    params = {
        title: "",
        sendFromName: "",
        sendFromEmail: "",
        companyName: "",
        body: "", 
        avatar: "",
    },
    onChange = (a) => {},
}) {
  const [value, setvalue] = useState(params.body);
    return (
 <div><div>
          <div style={{backgroundColor: '#F9F9F9', width: '100%', margin: 0, padding: 0}}>
            <div style={{color: 'transparent', fontSize: 0, visibility: 'hidden', width: '1px', margin: 0, padding: 0, borderWidth: 0, lineHeight: '0px!important', maxHeight: '1px', opacity: 0}}>
              <img data-imagetype="External" src="https://nimble-3ce40c23fedc.intercom-mail.com/q/hOKgcceKWCfJtlPRLUFkZw~~/AAAAAQA~/RgRj3WTOPVcIaW50ZXJjb21CCmH5zt_6YUruHyxSGGZhcm91cWFsZG9yaUBob3RtYWlsLmNvbVgEAAAqwA~~" width={1} height={1} border={0} ersmjxu2d /></div>
            <table align="center" border={0} cellSpacing={0} cellPadding={0} style={{width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', margin: 0, padding: 0, lineHeight: '100%!important'}}>
              <tbody><tr>
                  <td>
                    <table style={{width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', maxWidth: '635px', margin: 'auto', minWidth: '320px'}}>
                      <tbody><tr>
                          <td valign="top">
                            <table border={0} cellSpacing={0} cellPadding={0} style={{color: 'silver', fontSize: '13px', fontFamily: 'Helvetica Neue,Arial,sans-serif', width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', margin: '0 auto 26px auto', lineHeight: '26px'}} />
                          </td>
                        </tr>
                        <tr>
                          <td valign="top" style={{padding: '0 20px'}}>
                            <table align="center" border={0} cellSpacing={0} cellPadding={0} style={{color: '#545454', fontSize: '13px', fontFamily: 'Helvetica Neue,Arial,sans-serif', width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', borderRadius: '3px', margin: '0 auto 10px auto', lineHeight: '20px', backgroundClip: 'padding-box', WebkitBorderRadius: '3px'}}>
                              <tbody><tr>
                                  <td valign="top">
                                    <table border={0} cellSpacing={0} cellPadding={0} style={{width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', borderBottomStyle: 'none', backgroundClip: 'padding-box'}}>
                                      <tbody>
                                        <tr>
                                          <td style={{color: '#525252', fontSize: '15px', fontFamily: 'Helvetica Neue,Arial,sans-serif', backgroundColor: 'white', borderRadius: 0, padding: '40px', lineHeight: '22px', overflow: 'hidden', WebkitBorderRadius: '0 0 3px 3px', backgroundClip: 'padding-box'}}>
                                            <QuillEditor
                                            value={value}
                                            onChange={(_value)=> {onChange(_value)}}
                                            />
                                          </td>
                                        </tr>
                                      </tbody></table>
                                  </td>
                                </tr>
                              </tbody></table>
                            <table align="center" border={0} cellSpacing={0} cellPadding={0} style={{color: '#545454', fontSize: '13px', fontFamily: 'Helvetica Neue,Arial,sans-serif', width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', maxWidth: '100%', margin: '0 auto', lineHeight: '20px'}} />
                            <table width="100%" border={0} cellSpacing={0} cellPadding={0} style={{tableLayout: 'fixed'}}>
                              <tbody><tr>
                                  <td width="75%">
                                    <table border={0} cellSpacing={0} cellPadding={0} style={{color: '#545454', fontSize: '13px', fontFamily: 'Helvetica Neue,Arial,sans-serif', width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', maxWidth: '100%', margin: '0 auto', lineHeight: '20px'}}>
                                      <tbody><tr>
                                      {params.avatar ? 
                                        <>
                                                                                  <td width={40}>&nbsp;</td>
                                          <td align="left" valign="middle" width={50} style={{color: '#272727'}}>
                                            <img data-imagetype="External" src={params.avatar} alt="intercomavatar" style={{display: 'inline-block', width: '40px', height: '40px', textDecoration: 'none', borderRadius: '20px', maxWidth: '100%', outline: 'none', backgroundClip: 'padding-box', WebkitBorderRadius: '20px'}} />
                                          </td>
                                        </>
                                        :<></>
                                      }
                                          <td style={{color: '#999999'}}><span style={{color: '#'}} /><span style={{fontWeight:500}}>{params.sendFromName}</span> <p style={{all: "unset", display:"block", margin: "0px"}}>from {params.companyName}</p> </td>
                                        </tr>
                                      </tbody></table>
                                  </td>
                                  <td width="25%">
                                    <table border={0} cellSpacing={0} cellPadding={0} style={{color: '#545454', fontSize: '13px', fontFamily: 'Helvetica Neue,Arial,sans-serif', width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', maxWidth: '100%', margin: '0 auto', lineHeight: '20px'}}>
                                      <tbody><tr>
                                          <td align="right" valign="middle" style={{color: '#999999', fontSize: '11px', textAlign: 'right'}}>
                                            <a href="#" onClick={(e) => {e.preventDefault()}} target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" 
                                            style={{  color: "rgb(153,153,153)",
                                            textDecoration: "none",
                                            fontSize: "13px",
                                            position: "relative",
                                            top: "-2px",
                                          right: "30px"}} 
                                            data-linkindex={0}>Unsubscribe</a> </td>
                                        </tr>
                                      </tbody></table>
                                  </td>
                                </tr>
                              </tbody></table>
                          </td>
                        </tr>
                      </tbody></table>
                  </td>
                </tr>
              </tbody></table>
            <table style={{color: '#545454', fontSize: '13px', fontFamily: 'Helvetica Neue,Arial,sans-serif', width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', maxWidth: '100%', margin: '0 auto', lineHeight: '20px', letterSpacing: '0.02em'}}>
              <tbody><tr>
                  <td align="center" style={{color: '#999999', fontSize: '11px', textAlign: 'center', width: '100%', padding: '15px 0'}}>
                    Powered by <a href="#" onClick={(e) => {e.preventDefault()}}  target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" style={{color: '#999999', fontWeight: 'bold', textDecoration: 'none'}} data-linkindex={1}>Engageful</a><br aria-hidden="true" />
                  </td>
                </tr>
              </tbody></table>
             </div>
        </div>
      </div>
    );
}