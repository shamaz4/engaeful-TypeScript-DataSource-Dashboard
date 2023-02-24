/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-has-content */

import { useState, useEffect } from "react";
import Editor from "rich-markdown-editor"
import QuillEditor from "../../ControlsManager/Controls/QuillEditor/QuillEditor";

export default function PlainTemplate({
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
 <div>
         <QuillEditor
      value={value}
      onChange={(_value)=> {onChange(_value)}}
      />
    
    <table style={{color: 'rgb(84, 84, 84)', fontSize: '13px', fontFamily: '"Helvetica Neue", Arial, sans-serif', width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', maxWidth: '100%', margin: '0px auto', lineHeight: '20px', letterSpacing: '0.02em'}}>
        <tbody>
          <tr>
            <td align="center" style={{color: 'rgb(153,153,153)', fontSize: '11px', textAlign: 'center', width: '100%', padding: '40px 0px 0px 0px'}}><a href="#" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" data-linkindex={1} style={{textDecoration: 'none', color: 'rgb(153,153,153)'}}>Unsubscribe from our emails</a><br aria-hidden="true" /></td>
          </tr>
        </tbody>
      </table>
    

            <table style={{color: '#545454', fontSize: '13px', fontFamily: 'Helvetica Neue,Arial,sans-serif', width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', maxWidth: '100%', margin: '0 auto', lineHeight: '20px', letterSpacing: '0.02em'}}>
              <tbody><tr>
                  <td align="center" style={{color: '#999999', fontSize: '11px', textAlign: 'center', width: '100%', padding: '15px 0'}}>
                    Powered by <a href="#" onClick={(e) => {e.preventDefault()}}  target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" style={{color: '#999999', fontWeight: 'bold', textDecoration: 'none'}} data-linkindex={1}>Engageful</a><br aria-hidden="true" />
                  </td>
                </tr>
              </tbody></table>
  
      </div>
    );
}