<?xml version="1.0" encoding="UTF-8"?><xsl:stylesheet xmlns:xd="http://www.oxygenxml.com/ns/doc/xsl" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" exclude-result-prefixes="xs xd" version="2.0">
    
    <xsl:output indent="no"/>
    
    <xsl:template match="map">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE map PUBLIC "-//IFRS//DTD DITA Map//EN" "E:\working\2024\IASB\DocTypes\com.ifrs.doctype\dtd\ifrsMap.dtd"&gt;</xsl:text>
        <map>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </map>
    </xsl:template>
    
    <xsl:template match="bookmap">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE bookmap PUBLIC "-//IFRS//DTD DITA BookMap//EN" "E:\working\2024\IASB\DocTypes\com.ifrs.doctype\dtd\ifrsBookmap.dtd"&gt;</xsl:text>
        <bookmap>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </bookmap>
    </xsl:template>
    
    <xsl:template match="topic">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE topic PUBLIC "-//IFRS//DTD DITA Topic//EN" "E:\working\2024\IASB\DocTypes\com.ifrs.doctype\dtd\ifrsTopic.dtd"&gt;</xsl:text>
        <topic>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </topic>
    </xsl:template>
    
    <xsl:template match="paragraph">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE paragraph PUBLIC "-//IFRS//DTD DITA Paragraph//EN" "E:\working\2024\IASB\DocTypes\com.ifrs.doctype\dtd\paragraph.dtd"&gt;</xsl:text>
        <paragraph>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </paragraph>
    </xsl:template>
    
    <xsl:template match="glossentry">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE glossentry PUBLIC "-//IFRS//DTD DITA Glossary Entry//EN" "E:\working\2024\IASB\DocTypes\com.ifrs.doctype\dtd\ifrsGlossentry.dtd"&gt;</xsl:text>
        <glossentry>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </glossentry>
    </xsl:template>
    
    <xsl:template match="@* | node()">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="mapref">
        <xsl:variable name="removesepcialcharacter" select="translate(normalize-space(@navtitle), '@Â®*[{(-â€”:,.)}]‑?â€‘', ' ')"/>
        <mapref>
            <xsl:copy-of select="@*"/>
            <xsl:if test="@navtitle">
                <xsl:attribute name="copy-to">
                    <xsl:value-of select="translate(normalize-space(@navtitle), translate(normalize-space(@navtitle), $vAllowedSymbols, ' '), ' ')"/>
                    <!--<xsl:value-of select="normalize-space($removesepcialcharacter)"/>-->
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </mapref>
    </xsl:template>
    
    <xsl:template match="chapter">
        <xsl:variable name="removesepcialcharacter" select="translate(normalize-space(@navtitle), '@Â®*[{(-â€”:,.)}]‑?', ' ')"/>
        <chapter>
            <xsl:copy-of select="@*"/>
            <xsl:if test="@navtitle">
                <xsl:attribute name="copy-to">
                    <xsl:value-of select="translate(normalize-space(@navtitle), translate(normalize-space(@navtitle), $vAllowedSymbols, ' '), ' ')"/>
                    <!--<xsl:value-of select="translate(@navtitle, translate(@navtitle, $vAllowedSymbols, ' '), ' ')"/>-->
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </chapter>
    </xsl:template>
    
    
    <xsl:template match="appendices">
        <xsl:variable name="removesepcialcharacter" select="translate(normalize-space(@navtitle), '@Â®*[{(-â€”:,.)}]‑?', ' ')"/>
        <appendices>
            <xsl:copy-of select="@*"/>
            <xsl:if test="@navtitle">
                <xsl:attribute name="copy-to">
                    <xsl:value-of select="translate(normalize-space(@navtitle), translate(normalize-space(@navtitle), $vAllowedSymbols, ' '), ' ')"/>
                    <!--<xsl:value-of select="normalize-space($removesepcialcharacter)"/>-->
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </appendices>
    </xsl:template>
    
    <xsl:variable name="vAllowedSymbols" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'"/>
    
       <xsl:template match="topicref">
        
           <xsl:variable name="removesepcialcharacter" select="translate(@navtitle, '@Â®*[{(-:,.)}]', ' ')"/>
        <topicref>
            <xsl:copy-of select="@*"/>
            <xsl:if test="@navtitle">
                <xsl:attribute name="copy-to">
                    <xsl:value-of select="translate(normalize-space(@navtitle), translate(normalize-space(@navtitle), $vAllowedSymbols, ' '), ' ')"/>
                    <!--<xsl:value-of select="normalize-space($removesepcialcharacter)"/>-->
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </topicref>
    </xsl:template>
    
    <xsl:template match="appendix">
        <xsl:variable name="removesepcialcharacter" select="translate(normalize-space(@navtitle), '@Â®*[{(-â€”:,.)}]‑?', ' ')"/>
        <appendix>
            <xsl:copy-of select="@*"/>
            <xsl:if test="@navtitle">
                <xsl:attribute name="copy-to">
                    <xsl:value-of select="translate(normalize-space(@navtitle), translate(normalize-space(@navtitle), $vAllowedSymbols, ' '), ' ')"/>
                    <!--<xsl:value-of select="normalize-space($removesepcialcharacter)"/>-->
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </appendix>
    </xsl:template>
    
    <xsl:template match="keydef">
        <xsl:variable name="removesepcialcharacter" select="translate(normalize-space(@navtitle), '@Â®*[{(-â€”:,.)}]‑?', ' ')"/>
        <keydef>
            <xsl:copy-of select="@*"/>
            <xsl:if test="@navtitle">
                <xsl:attribute name="copy-to">
                    <xsl:value-of select="translate(normalize-space(@navtitle), translate(normalize-space(@navtitle), $vAllowedSymbols, ' '), ' ')"/>
                    <!--<xsl:value-of select="normalize-space($removesepcialcharacter)"/>-->
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </keydef>
    </xsl:template>
    
    <xsl:template match="bookabstract">
        <xsl:variable name="removesepcialcharacter" select="translate(normalize-space(@navtitle), '@Â®*[{(-â€”:,.)}]‑?', ' ')"/>
        <bookabstract>
            <xsl:copy-of select="@*"/>
            <xsl:if test="@navtitle">
                <xsl:attribute name="copy-to">
                    <xsl:value-of select="translate(normalize-space(@navtitle), translate(normalize-space(@navtitle), $vAllowedSymbols, ' '), ' ')"/>
                    <!--<xsl:value-of select="normalize-space($removesepcialcharacter)"/>-->
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </bookabstract>
    </xsl:template>
    
</xsl:stylesheet>
