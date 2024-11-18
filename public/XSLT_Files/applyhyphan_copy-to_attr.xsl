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
    
    <xsl:variable name="vAllowedSymbols" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'"/>
    
    
    <xsl:template match="mapref">
        
        <mapref>
            <xsl:copy-of select="@* except @copy-to"/>
            <xsl:if test="@copy-to">
                <xsl:attribute name="copy-to">
                    <xsl:value-of select="translate(@copy-to, translate(@copy-to, $vAllowedSymbols, ' '), '-')"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </mapref>
    </xsl:template>
    
    <xsl:template match="topicref">
        
        <topicref>
            <xsl:copy-of select="@* except @copy-to"/>
            <xsl:if test="@copy-to">
                <xsl:attribute name="copy-to">
                    <xsl:value-of select="translate(@copy-to, translate(@copy-to, $vAllowedSymbols, ' '), '-')"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </topicref>
    </xsl:template>
    
    <xsl:template match="chapter">
        
        <chapter>
            <xsl:copy-of select="@* except @copy-to"/>
            <xsl:if test="@copy-to">
                <xsl:attribute name="copy-to">
                    <xsl:value-of select="translate(@copy-to, translate(@copy-to, $vAllowedSymbols, ' '), '-')"/>
                </xsl:attribute>
            </xsl:if>
            
            <xsl:apply-templates/>
        </chapter>
    </xsl:template>
    
    <xsl:template match="appendices">
        
        <appendices>
            <xsl:copy-of select="@* except @copy-to"/>
            <xsl:if test="@copy-to">
                <xsl:attribute name="copy-to">
                    <xsl:value-of select="translate(@copy-to, translate(@copy-to, $vAllowedSymbols, ' '), '-')"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </appendices>
    </xsl:template>
    
    <xsl:template match="appendix">
        
        <appendix>
            <xsl:copy-of select="@* except @copy-to"/>
            <xsl:if test="@copy-to">
                <xsl:attribute name="copy-to">
                    <xsl:value-of select="translate(@copy-to, translate(@copy-to, $vAllowedSymbols, ' '), '-')"/>
                </xsl:attribute>
            </xsl:if>
            
            <xsl:apply-templates/>
        </appendix>
    </xsl:template>
    
    <xsl:template match="keydef">
        
        <keydef>
            <xsl:copy-of select="@* except @copy-to"/>
            <xsl:if test="@copy-to">
                <xsl:attribute name="copy-to">
                    <xsl:value-of select="translate(@copy-to, translate(@copy-to, $vAllowedSymbols, ' '), '-')"/>
                </xsl:attribute>
            </xsl:if>
            
            <xsl:apply-templates/>
        </keydef>
    </xsl:template>
    
    <xsl:template match="bookabstract">
        
        <bookabstract>
            <xsl:copy-of select="@* except @copy-to"/>
            <xsl:if test="@copy-to">
                <xsl:attribute name="copy-to">
                    <xsl:value-of select="translate(@copy-to, translate(@copy-to, $vAllowedSymbols, ' '), '-')"/>
                </xsl:attribute>
            </xsl:if>
            
            <xsl:apply-templates/>
        </bookabstract>
    </xsl:template>
    
</xsl:stylesheet>
