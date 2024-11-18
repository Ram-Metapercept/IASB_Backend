<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="xs" version="2.0">
    
    <xsl:template match="@* | node()">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>
    
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
                <xsl:if test="@id">
                    <xsl:attribute name="id">
                        <xsl:value-of select="translate(translate(@id, '.', '_'), '-', '_')"/>
                        <!--<xsl:value-of select="replace(@id, '.', '_')"/>-->
                    </xsl:attribute>
                </xsl:if>
                <xsl:apply-templates select="@* except @id"/>
                <xsl:apply-templates/>
            </topic>
        </xsl:template>
    
        
        <xsl:template match="paragraph">
            <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE paragraph PUBLIC "-//IFRS//DTD DITA Paragraph//EN" "E:\working\2024\IASB\DocTypes\com.ifrs.doctype\dtd\paragraph.dtd"&gt;</xsl:text>
            <paragraph>
                <xsl:if test="@id">
                    <xsl:attribute name="id">
                        <xsl:value-of select="translate(translate(@id, '.', '_'), '-', '_')"/>
                        <!--<xsl:value-of select="replace(@id, '.', '_')"/>-->
                    </xsl:attribute>
                </xsl:if>
                <xsl:apply-templates select="@* except @id"/>
                <xsl:apply-templates/>
            </paragraph>
        </xsl:template>
        
        <xsl:template match="glossentry">
            <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE glossentry PUBLIC "-//IFRS//DTD DITA Glossary Entry//EN" "E:\working\2024\IASB\DocTypes\com.ifrs.doctype\dtd\ifrsGlossentry.dtd"&gt;</xsl:text>
            <glossentry>
                <xsl:if test="@id">
                    <xsl:attribute name="id">
                        <xsl:value-of select="translate(translate(@id, '.', '_'), '-', '_')"/>
                        <!--<xsl:value-of select="replace(@id, '.', '_')"/>-->
                    </xsl:attribute>
                </xsl:if>
                <xsl:apply-templates select="@* except @id"/>
                <xsl:apply-templates/>
            </glossentry>
        </xsl:template>
    
    <xsl:template match="@id">
        <xsl:attribute name="id">
            <xsl:value-of select="translate(translate(., '.', '_'), '-', '_')"/>
        </xsl:attribute>
    </xsl:template>
    
    
    <xsl:template match="xref">
        <xref>
            <xsl:if test="@href">
                <xsl:choose>
                    <xsl:when test="contains(@href, '#')">
                        <xsl:attribute name="href">
                            <xsl:variable name="aa" select="translate(translate(substring-after(@href, '#'), '.', '_'), '-', '_')"/>
                            <xsl:value-of select="concat(substring-before(@href, '#'), '#', $aa)"/>
                        </xsl:attribute>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:attribute name="href">
                            <xsl:value-of select="@href"/>
                        </xsl:attribute>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:if>
            <xsl:copy-of select="@* except @href"/>
            <xsl:apply-templates/>
        </xref>
    </xsl:template>
    
    <xsl:template match="link">
        <link>
            <xsl:if test="@href">
                <xsl:choose>
                    <xsl:when test="contains(@href, '#')">
                        <xsl:attribute name="href">
                            <xsl:variable name="aa" select="translate(translate(substring-after(@href, '#'), '.', '_'), '-', '_')"/>
                            <xsl:value-of select="concat(substring-before(@href, '#'), '#', $aa)"/>
                        </xsl:attribute>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:attribute name="href">
                            <xsl:value-of select="@href"/>
                        </xsl:attribute>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:if>
            <xsl:copy-of select="@* except @href"/>
            <xsl:apply-templates/>
        </link>
    </xsl:template>
    

</xsl:stylesheet>

